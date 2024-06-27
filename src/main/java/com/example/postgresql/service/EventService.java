package com.example.postgresql.service;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.sql.Date;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public void saveEvent(HttpSession session, EventDTO eventDTO) {
        String username = (String) session.getAttribute("username");
        User user = userRepository.findByUsername(username);

        Event event = new Event();

        event.setEventContent(eventDTO.getDescription());
        event.setStartEventTime(eventDTO.getStartTime());
        event.setStopEventTime(eventDTO.getEndTime());
        event.setEventDate(Date.valueOf(eventDTO.getFormattedDate()));
        event.setRoomId(eventDTO.getRoomId());
        event.setUserId(user.getId());

        eventRepository.save(event);
    }
}
