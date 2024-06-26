package com.example.postgresql.repository;

import com.example.postgresql.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository  extends JpaRepository<Event, Long> {
}