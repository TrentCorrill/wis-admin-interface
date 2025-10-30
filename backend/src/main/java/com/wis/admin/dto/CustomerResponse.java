package com.wis.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CustomerResponse {
    private String id;
    private String phone;
    private String email;
    private String name;
    private String subscriptionStatus;
    private String currentSeason;
    private Instant createdAt;
    private Instant lastActivityAt;
    private Integer messageCount;
}
