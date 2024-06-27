package com.example.postgresql.repository;

import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Room findByRoomName(String roomname);
}
