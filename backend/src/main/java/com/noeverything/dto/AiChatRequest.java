package com.noeverything.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {
    private Long conversationId;

    @NotBlank(message = "Message content is required")
    private String message;

    private String mode = "LEARN"; // LEARN, PRACTICE, DOUBT, INTERVIEW, EXAM, REVISION
    private String topic;

    public AiChatRequest() {}

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
