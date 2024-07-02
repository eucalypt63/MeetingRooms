package com.example.postgresql.service;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.RoomRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.sql.Date;

@Service
public class EventService {
    @PersistenceContext
    private EntityManager entityManager;

    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    public EventService(EventRepository eventRepository, RoomRepository roomRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public void saveEvent(HttpSession session, EventDTO eventDTO) {
        System.out.println(eventDTO);
        User user = (User) session.getAttribute("user");
        Room room = roomRepository.findByRoomName(eventDTO.getRoomName());

        Event event = new Event(eventDTO.getDescription(), eventDTO.getStartTime(), eventDTO.getEndTime(),
                                Date.valueOf(eventDTO.getFormattedDate()), user, room);
        eventRepository.save(event);
    }

    @Transactional
    public void changeEvent(EventDTO eventDTO) {
        Event event = eventRepository.findById(eventDTO.getId()).orElse(null);
        if (event != null) {
            event.setEventDate(Date.valueOf(eventDTO.getFormattedDate()));
            event.setStartEventTime(eventDTO.getStartTime());
            event.setStopEventTime(eventDTO.getEndTime());
            event.setEventContent(eventDTO.getDescription());
            eventRepository.save(event);
        }
    }
}
