package com.wis.admin.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.azure.spring.data.cosmos.repository.Query;
import com.wis.admin.entity.CustomerEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends CosmosRepository<CustomerEntity, String> {

    List<CustomerEntity> findByPhone(String phone);

    @Query("SELECT * FROM c WHERE CONTAINS(LOWER(c.phone), LOWER(@searchTerm)) OR CONTAINS(LOWER(c.name), LOWER(@searchTerm))")
    List<CustomerEntity> searchCustomers(String searchTerm);

    List<CustomerEntity> findBySubscriptionStatus(String status);
}
