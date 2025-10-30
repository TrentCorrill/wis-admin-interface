package com.wis.admin.entity;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Data
@Container(containerName = "messages")
public class MessageEntity {

    @Id
    private String id;

    @PartitionKey
    private String customerId;

    private String conversationId;
    private String direction; // "inbound" or "outbound"
    private String content;
    private String messageType; // "sms", "system", "devotional", etc.
    private String status; // "sent", "delivered", "failed"
    private Instant timestamp;
    private String from;
    private String to;
}
