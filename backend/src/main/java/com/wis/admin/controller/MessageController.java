package com.wis.admin.controller;

import com.wis.admin.dto.ConversationResponse;
import com.wis.admin.dto.CustomerResponse;
import com.wis.admin.dto.MessageResponse;
import com.wis.admin.entity.CustomerEntity;
import com.wis.admin.entity.MessageEntity;
import com.wis.admin.repository.CustomerRepository;
import com.wis.admin.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageRepository messageRepository;
    private final CustomerRepository customerRepository;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ConversationResponse> getCustomerMessages(@PathVariable String customerId) {
        log.info("Fetching messages for customer: {}", customerId);

        List<MessageEntity> messages = messageRepository.findByCustomerIdOrderByTimestampDesc(customerId);

        CustomerEntity customer = customerRepository.findById(customerId)
                .orElse(null);

        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        CustomerResponse customerResponse = CustomerResponse.builder()
                .id(customer.getId())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .name(customer.getName())
                .subscriptionStatus(customer.getSubscriptionStatus())
                .currentSeason(customer.getCurrentSeason())
                .createdAt(customer.getCreatedAt())
                .lastActivityAt(customer.getLastActivityAt())
                .messageCount(messages.size())
                .build();

        List<MessageResponse> messageResponses = messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        ConversationResponse response = ConversationResponse.builder()
                .customer(customerResponse)
                .messages(messageResponses)
                .totalMessages(messages.size())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}/range")
    public ResponseEntity<List<MessageResponse>> getMessagesByDateRange(
            @PathVariable String customerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        log.info("Fetching messages for customer: {} between {} and {}", customerId, startDate, endDate);

        List<MessageEntity> messages = messageRepository
                .findByCustomerIdAndTimestampBetween(customerId, startDate, endDate);

        List<MessageResponse> response = messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MessageResponse>> searchMessages(@RequestParam String query) {
        log.info("Searching messages with query: {}", query);

        List<MessageEntity> messages = messageRepository.searchMessages(query);

        List<MessageResponse> response = messages.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private MessageResponse toResponse(MessageEntity entity) {
        return MessageResponse.builder()
                .id(entity.getId())
                .customerId(entity.getCustomerId())
                .conversationId(entity.getConversationId())
                .direction(entity.getDirection())
                .content(entity.getContent())
                .messageType(entity.getMessageType())
                .status(entity.getStatus())
                .timestamp(entity.getTimestamp())
                .from(entity.getFrom())
                .to(entity.getTo())
                .build();
    }
}
