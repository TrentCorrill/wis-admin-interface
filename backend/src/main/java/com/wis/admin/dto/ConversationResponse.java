package com.wis.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ConversationResponse {
    private CustomerResponse customer;
    private List<MessageResponse> messages;
    private Integer totalMessages;
}
