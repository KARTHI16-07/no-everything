package com.noeverything.dto;

import java.util.List;

public class AiChatResponse {
    private Long conversationId;
    private String mode;
    private String reply;
    private boolean fallbackMode;
    private List<AiMessageDto> history;

    public AiChatResponse() {}

    public AiChatResponse(Long conversationId, String mode, String reply, boolean fallbackMode, List<AiMessageDto> history) {
        this.conversationId = conversationId;
        this.mode = mode;
        this.reply = reply;
        this.fallbackMode = fallbackMode;
        this.history = history;
    }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public boolean isFallbackMode() { return fallbackMode; }
    public void setFallbackMode(boolean fallbackMode) { this.fallbackMode = fallbackMode; }

    public List<AiMessageDto> getHistory() { return history; }
    public void setHistory(List<AiMessageDto> history) { this.history = history; }
}
