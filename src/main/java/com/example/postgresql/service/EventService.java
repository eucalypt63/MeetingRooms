package com.example.postgresql.service;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.RoomRepository;
import com.example.postgresql.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.sql.Date;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    public EventService(EventRepository eventRepository, RoomRepository roomRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
    }

    public void saveEvent(HttpSession session, EventDTO eventDTO) {
        User user = (User) session.getAttribute("user");
        Room room = roomRepository.findByRoomName(eventDTO.getRoomname());

        Event event = new Event();

        event.setEventContent(eventDTO.getDescription());
        event.setStartEventTime(eventDTO.getStartTime());
        event.setStopEventTime(eventDTO.getEndTime());
        event.setEventDate(Date.valueOf(eventDTO.getFormattedDate()));
        event.setRoomId(room.getId());
        event.setUserId(user.getId());

        eventRepository.save(event);
    }
}
