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
import java.util.Optional;

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
        Optional<Room> roomOptional = Optional.ofNullable(roomRepository.findByRoomName(eventDTO.getRoomName()));

        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            Event event = new Event(eventDTO.getDescription(), eventDTO.getStartTime(), eventDTO.getEndTime(),
                    Date.valueOf(eventDTO.getFormattedDate()), user, room);
            eventRepository.save(event);
        }
        else {
            //Исключение "Комната не найдена"
        }
    }

    @Transactional
    public void changeEvent(EventDTO eventDTO) {
        Optional<Event> eventOptional = eventRepository.findById(eventDTO.getId());
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setEventDate(Date.valueOf(eventDTO.getFormattedDate()));
            event.setStartEventTime(eventDTO.getStartTime());
            event.setStopEventTime(eventDTO.getEndTime());
            event.setEventContent(eventDTO.getDescription());
            eventRepository.save(event);
        } else {
            // Исключение: "Ошибка обновления события"
        }
    }
}
