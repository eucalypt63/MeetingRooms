package com.example.postgresql.service;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.DTO.RoomDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.RoomRepository;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.sql.Date;

@Service
public class RoomService {
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    public RoomService(EventRepository eventRepository, RoomRepository roomRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
    }

    public void saveEvent(HttpSession session, RoomDTO roomDTO) {
        Room room = new Room();

        room.setRoomName(roomDTO.getRoomName());
        room.setStatus(roomDTO.getRoomStatus());

        roomRepository.save(room);
    }
}
