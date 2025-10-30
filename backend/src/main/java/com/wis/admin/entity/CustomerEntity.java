package com.wis.admin.entity;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.Instant;

@Data
@Container(containerName = "customers")
public class CustomerEntity {

    @Id
    private String id;

    @PartitionKey
    private String phone;

    private String email;
    private String name;
    private String subscriptionStatus;
    private String currentSeason;
    private Instant createdAt;
    private Instant lastActivityAt;
}
