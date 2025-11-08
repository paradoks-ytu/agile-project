package com.paradoks.agileproject.repository;

import com.paradoks.agileproject.model.SessionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<SessionModel, Long> {

    Optional<SessionModel> findByTokenAndActiveTrue(String token);

    void deleteByToken(String token);
}