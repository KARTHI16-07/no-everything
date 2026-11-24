package com.noeverything.dto;

public class OptionDto {
    private String optionKey;
    private String optionText;
    private Boolean isCorrect; // null in test mode, provided in practice mode

    public OptionDto() {}

    public OptionDto(String optionKey, String optionText, Boolean isCorrect) {
        this.optionKey = optionKey;
        this.optionText = optionText;
        this.isCorrect = isCorrect;
    }

    public String getOptionKey() { return optionKey; }
    public void setOptionKey(String optionKey) { this.optionKey = optionKey; }

    public String getOptionText() { return optionText; }
    public void setOptionText(String optionText) { this.optionText = optionText; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
}
