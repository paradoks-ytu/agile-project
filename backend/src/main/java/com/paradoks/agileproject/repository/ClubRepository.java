package com.paradoks.agileproject.repository;

import com.paradoks.agileproject.model.ClubModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<ClubModel, Long> {

    Optional<ClubModel> findByEmail(String email);
    boolean existsByName(String name);
}