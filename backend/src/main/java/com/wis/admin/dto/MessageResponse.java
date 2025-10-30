package com.wis.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessageResponse {
    private String id;
    private String customerId;
    private String conversationId;
    private String direction;
    private String content;
    private String messageType;
    private String status;
    private Instant timestamp;
    private String from;
    private String to;
}
