package com.noeverything.controller;

import com.noeverything.dto.AiChatRequest;
import com.noeverything.dto.AiChatResponse;
import com.noeverything.dto.AiMessageDto;
import com.noeverything.dto.ApiResponse;
import com.noeverything.entity.AiConversation;
import com.noeverything.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@Valid @RequestBody AiChatRequest request) {
        AiChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<AiConversation>>> getConversations() {
        List<AiConversation> convs = aiService.getUserConversations();
        return ResponseEntity.ok(ApiResponse.success(convs));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<List<AiMessageDto>>> getConversationMessages(@PathVariable Long id) {
        List<AiMessageDto> messages = aiService.getConversationMessages(id);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(@PathVariable Long id) {
        aiService.deleteConversation(id);
        return ResponseEntity.ok(ApiResponse.success("Conversation cleared", null));
    }
}
