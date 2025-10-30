package com.wis.admin.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.azure.spring.data.cosmos.repository.Query;
import com.wis.admin.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MessageRepository extends CosmosRepository<MessageEntity, String> {

    List<MessageEntity> findByCustomerId(String customerId);

    Page<MessageEntity> findByCustomerId(String customerId, Pageable pageable);

    List<MessageEntity> findByCustomerIdAndTimestampBetween(String customerId, Instant start, Instant end);

    @Query("SELECT * FROM c WHERE c.customerId = @customerId ORDER BY c.timestamp DESC")
    List<MessageEntity> findByCustomerIdOrderByTimestampDesc(String customerId);

    @Query("SELECT * FROM c WHERE CONTAINS(LOWER(c.content), LOWER(@searchTerm))")
    List<MessageEntity> searchMessages(String searchTerm);
}
