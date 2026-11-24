package com.noeverything.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.noeverything.dto.AiChatRequest;
import com.noeverything.dto.AiChatResponse;
import com.noeverything.dto.AiMessageDto;
import com.noeverything.entity.AiConversation;
import com.noeverything.entity.AiMessage;
import com.noeverything.entity.User;
import com.noeverything.exception.ResourceNotFoundException;
import com.noeverything.repository.AiConversationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String geminiApiUrl;

    private final AiConversationRepository conversationRepository;
    private final AuthService authService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public AiService(AiConversationRepository conversationRepository, AuthService authService) {
        this.conversationRepository = conversationRepository;
        this.authService = authService;
    }

    @Transactional
    public AiChatResponse chat(AiChatRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        String mode = request.getMode() != null ? request.getMode().toUpperCase() : "LEARN";

        AiConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findByIdAndUser(request.getConversationId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + request.getConversationId()));
        } else {
            String title = request.getMessage().length() > 40
                    ? request.getMessage().substring(0, 40) + "..."
                    : request.getMessage();
            conversation = new AiConversation(user, title, mode);
            conversation = conversationRepository.save(conversation);
        }

        // Add user message
        conversation.addMessage("user", request.getMessage());

        String aiReply;
        boolean isFallback = false;

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                aiReply = callGeminiApi(conversation.getMessages(), mode, request.getMessage());
            } catch (Exception e) {
                aiReply = generateOfflineIntelligence(mode, request.getMessage());
                isFallback = true;
            }
        } else {
            aiReply = generateOfflineIntelligence(mode, request.getMessage());
            isFallback = true;
        }

        // Add assistant message
        conversation.addMessage("assistant", aiReply);
        AiConversation saved = conversationRepository.save(conversation);

        List<AiMessageDto> history = saved.getMessages().stream()
                .map(m -> new AiMessageDto(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
                .collect(Collectors.toList());

        return new AiChatResponse(saved.getId(), saved.getMode(), aiReply, isFallback, history);
    }

    public List<AiConversation> getUserConversations() {
        User user = authService.getCurrentAuthenticatedUser();
        return conversationRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    public List<AiMessageDto> getConversationMessages(Long conversationId) {
        User user = authService.getCurrentAuthenticatedUser();
        AiConversation conv = conversationRepository.findByIdAndUser(conversationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        return conv.getMessages().stream()
                .map(m -> new AiMessageDto(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteConversation(Long conversationId) {
        User user = authService.getCurrentAuthenticatedUser();
        AiConversation conv = conversationRepository.findByIdAndUser(conversationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));
        conversationRepository.delete(conv);
    }

    private String callGeminiApi(List<AiMessage> messages, String mode, String userPrompt) throws Exception {
        String systemPrompt = getSystemPromptForMode(mode);
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        List<Map<String, Object>> contents = new ArrayList<>();
        // Add system instruction context
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt))));
        contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "Understood. I am configured in " + mode + " mode for NO EVERYTHING."))));

        // Add last 6 messages context
        int start = Math.max(0, messages.size() - 6);
        for (int i = start; i < messages.size(); i++) {
            AiMessage m = messages.get(i);
            String role = m.getRole().equals("assistant") ? "model" : "user";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", m.getContent()))));
        }

        Map<String, Object> body = Map.of(
                "contents", contents,
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1024
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            }
        }
        throw new RuntimeException("Empty response from Gemini API");
    }

    private String getSystemPromptForMode(String mode) {
        switch (mode.toUpperCase()) {
            case "PRACTICE":
                return "You are the NO EVERYTHING Practice Mentor. Present concise technical problem challenges (Java, Python, SQL, Aptitude), give progressive hints, and evaluate logic.";
            case "DOUBT":
                return "You are the NO EVERYTHING Debugging Specialist. Analyze code errors, explain root causes with line-by-line precision, and provide clean, idiomatic solutions.";
            case "INTERVIEW":
                return "You are a Principal Software Architect conducting an elite technical interview. Ask challenging follow-up questions, evaluate communication, algorithms, and system design.";
            case "EXAM":
                return "You are the NQT & Competitive Examination Master. Dissect tricky MCQs, time-complexity traps, edge cases, and competitive coding constraints.";
            case "REVISION":
                return "You are the High-Yield Revision Engine. Deliver distilled cheat-sheets, mental models, key syntax, and bulleted summaries for rapid recall.";
            case "LEARN":
            default:
                return "You are NO EVERYTHING AI — an elite intellectual tutor in software engineering, mathematics, computer science, and disciplined personal growth.";
        }
    }

    private String generateOfflineIntelligence(String mode, String prompt) {
        String query = prompt.toLowerCase();
        StringBuilder sb = new StringBuilder();

        switch (mode.toUpperCase()) {
            case "PRACTICE":
                sb.append("### [PRACTICE PROTOCOL: ").append(mode).append("]\n\n");
                if (query.contains("sql") || query.contains("database")) {
                    sb.append("**Challenge: Consecutive Active Days (SQL Window Functions)**\n\n");
                    sb.append("Given a table `user_logins(user_id, login_date)`, write a query to find users who logged in for at least 3 consecutive days.\n\n");
                    sb.append("```sql\nWITH numbered AS (\n  SELECT user_id, login_date,\n         ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date) AS rn\n  FROM user_logins\n)\nSELECT user_id\nFROM numbered\nGROUP BY user_id, DATEADD(day, -rn, login_date)\nHAVING COUNT(*) >= 3;\n```\n\n");
                    sb.append("**Hint:** Use `DATE_SUB` or `DATEADD` with the row number partition pattern.");
                } else if (query.contains("python")) {
                    sb.append("**Challenge: Two Pointers Optimal Substring**\n\n");
                    sb.append("Write a function to find the length of the longest substring without repeating characters in $O(N)$ time and $O(K)$ space.\n\n");
                    sb.append("```python\ndef length_of_longest_substring(s: str) -> int:\n    seen = {}\n    max_len = start = 0\n    for i, char in enumerate(s):\n        if char in seen and seen[char] >= start:\n            start = seen[char] + 1\n        seen[char] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len\n```");
                } else {
                    sb.append("**Challenge: Thread-Safe Singleton Pattern (Java)**\n\n");
                    sb.append("Implement Double-Checked Locking Singleton with the `volatile` keyword to prevent instruction reordering:\n\n");
                    sb.append("```java\npublic class Engine {\n    private static volatile Engine instance;\n    private Engine() {}\n\n    public static Engine getInstance() {\n        if (instance == null) {\n            synchronized (Engine.class) {\n                if (instance == null) {\n                    instance = new Engine();\n                }\n            }\n        }\n        return instance;\n    }\n}\n```");
                }
                break;

            case "DOUBT":
                sb.append("### [DOUBT RESOLUTION ENGINE]\n\n");
                sb.append("**Diagnostic Analysis:**\n");
                sb.append("1. **Core Mechanism:** When analyzing `").append(prompt.trim()).append("`, always verify memory allocations, concurrency constraints, and reference semantics.\n");
                sb.append("2. **Common Trap:** Beware of off-by-one errors in sliding window loops, and shallow vs deep copying in complex collections.\n");
                sb.append("3. **Recommended Fix:** Always write unit assertions verifying boundary conditions ($0, 1, N$).");
                break;

            case "INTERVIEW":
                sb.append("### [TECHNICAL INTERVIEW SIMULATION]\n\n");
                sb.append("**Interviewer:** \"Let's analyze your engineering judgment.\"\n\n");
                sb.append("**Question:** In high-throughput distributed systems, how do you handle cache invalidation during write-heavy bursts, and when would you choose write-through over write-back caching?\n\n");
                sb.append("**Key Evaluation Dimensions:**\n");
                sb.append("- Consistency vs Latency trade-offs (CAP theorem)\n");
                sb.append("- Thundering herd problem mitigation (mutex locking / probabilistic early expiration)\n");
                sb.append("- Idempotency in event-driven message queues (Kafka / RabbitMQ)");
                break;

            case "EXAM":
                sb.append("### [NQT / EXAM MASTERY DRILL]\n\n");
                sb.append("**High-Frequency NQT Trap:**\n");
                sb.append("- In Java, `String s1 = \"test\"; String s2 = new String(\"test\");` will evaluate `s1 == s2` as `false`, because `new` creates an object outside the String Pool in standard heap space.\n");
                sb.append("- In SQL, `NULL = NULL` yields `UNKNOWN` (treated as false in `WHERE` clauses). Always use `IS NULL` or `COALESCE`.\n");
                sb.append("- Time complexity of `HashMap.get()` is $O(1)$ amortized, but degrades to $O(\\log N)$ in Java 8+ via Red-Black Tree binning during high hash collisions.");
                break;

            case "REVISION":
                sb.append("### [REVISION CHEAT SHEET]\n\n");
                sb.append("| Topic | Time Complexity | Space Complexity | Core Caveat |\n");
                sb.append("| :--- | :--- | :--- | :--- |\n");
                sb.append("| Binary Search | $O(\\log N)$ | $O(1)$ | Array must be strictly sorted |\n");
                sb.append("| Merge Sort | $O(N \\log N)$ | $O(N)$ | Stable sort, high memory overhead |\n");
                sb.append("| Quick Sort | $O(N \\log N)$ avg | $O(\\log N)$ | Degrades to $O(N^2)$ with poor pivot |\n");
                sb.append("| Heap / PriorityQueue | $O(\\log N)$ push/pop | $O(N)$ | Unordered traversal |\n\n");
                sb.append("**Execution Rule:** Discipline is not a feeling; it is an invariant system loop.");
                break;

            case "LEARN":
            default:
                sb.append("### [NO EVERYTHING INTELLECT: ").append(mode).append(" MODE]\n\n");
                sb.append("Let's break down your inquiry: **").append(prompt.trim()).append("**\n\n");
                sb.append("#### 1. First-Principles Foundation\n");
                sb.append("Every robust software system and personal discipline protocol reduces to three fundamental primitives: **State**, **Transformation**, and **Invariants**.\n\n");
                sb.append("#### 2. Architectural Blueprint\n");
                sb.append("- **Modular Isolation:** Separate pure computation from side-effects.\n");
                sb.append("- **Deterministic Execution:** Eliminating ambiguity in your habits and code guarantees reproducibility.\n");
                sb.append("- **Radical Optimization:** Remove everything non-essential so maximum force is applied to the primary vector of progress.\n\n");
                sb.append("> *\"We exist to create and champion the exceptional.\"*");
                break;
        }

        return sb.toString();
    }
}
