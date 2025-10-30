package com.wis.admin.controller;

import com.wis.admin.dto.CustomerResponse;
import com.wis.admin.entity.CustomerEntity;
import com.wis.admin.repository.CustomerRepository;
import com.wis.admin.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final MessageRepository messageRepository;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        log.info("Fetching all customers");

        List<CustomerEntity> customers = (List<CustomerEntity>) customerRepository.findAll();

        List<CustomerResponse> response = customers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable String id) {
        log.info("Fetching customer: {}", id);

        return customerRepository.findById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponse>> searchCustomers(@RequestParam String query) {
        log.info("Searching customers with query: {}", query);

        List<CustomerEntity> customers = customerRepository.searchCustomers(query);

        List<CustomerResponse> response = customers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-phone/{phone}")
    public ResponseEntity<List<CustomerResponse>> getCustomerByPhone(@PathVariable String phone) {
        log.info("Fetching customers by phone: {}", phone);

        List<CustomerEntity> customers = customerRepository.findByPhone(phone);

        List<CustomerResponse> response = customers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private CustomerResponse toResponse(CustomerEntity entity) {
        // Count messages for this customer
        int messageCount = messageRepository.findByCustomerId(entity.getId()).size();

        return CustomerResponse.builder()
                .id(entity.getId())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .name(entity.getName())
                .subscriptionStatus(entity.getSubscriptionStatus())
                .currentSeason(entity.getCurrentSeason())
                .createdAt(entity.getCreatedAt())
                .lastActivityAt(entity.getLastActivityAt())
                .messageCount(messageCount)
                .build();
    }
}
