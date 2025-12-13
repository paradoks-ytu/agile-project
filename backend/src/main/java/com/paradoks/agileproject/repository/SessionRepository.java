package com.paradoks.agileproject.repository;

import com.paradoks.agileproject.model.ClubSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<ClubSession, Long> {

    Optional<ClubSession> findByTokenAndActiveTrue(String token);

    void deleteByToken(String token);
}