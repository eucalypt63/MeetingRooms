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

    public void saveEvent(HttpSession session, EventDTO eventDTO) {
        User user = (User) session.getAttribute("user");
        Room room = roomRepository.findByRoomName(eventDTO.getRoomName());

        Event event = new Event();

        event.setEventContent(eventDTO.getDescription());
        event.setStartEventTime(eventDTO.getStartTime());
        event.setStopEventTime(eventDTO.getEndTime());
        event.setEventDate(Date.valueOf(eventDTO.getFormattedDate()));
        event.setRoomId(room.getId());
        event.setUserId(user.getId());

        eventRepository.save(event);
    }

    @Transactional
    public void changeEvent(EventDTO eventDTO) {
        entityManager.createQuery("UPDATE Event e SET e.eventDate = :newDate, " +
                                     "e.startEventTime = :newStartEventTime," +
                                     "e.stopEventTime = :newStopEventTime," +
                                     "e.eventContent = :newEventContent WHERE e.id = :eventId")
                .setParameter("newDate", Date.valueOf(eventDTO.getFormattedDate()))
                .setParameter("newStartEventTime", eventDTO.getStartTime())
                .setParameter("newStopEventTime", eventDTO.getEndTime())
                .setParameter("newEventContent", eventDTO.getDescription())
                .setParameter("eventId", eventDTO.getId())
                .executeUpdate();
    }
}
