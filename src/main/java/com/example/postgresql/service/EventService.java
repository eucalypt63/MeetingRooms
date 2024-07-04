package com.example.postgresql.service;

import com.example.postgresql.DTO.EventRequestDTO;
import com.example.postgresql.exception.EventNotFoundException;
import com.example.postgresql.exception.RoomNotFoundException;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.RoomRepository;
import com.example.postgresql.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.sql.Date;
import java.util.Optional;

@Service
public class EventService {
    @PersistenceContext
    private EntityManager entityManager;

    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, RoomRepository roomRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public void saveEvent(EventRequestDTO eventRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Optional<Room> roomOptional = Optional.ofNullable(roomRepository.findByRoomName(eventRequestDTO.getRoomName()));
        roomOptional.ifPresentOrElse(
                room -> {
                    Event event = new Event(eventRequestDTO.getDescription(), eventRequestDTO.getStartTime(), eventRequestDTO.getEndTime(),
                            Date.valueOf(eventRequestDTO.getFormattedDate()), userRepository.findByUsername(userDetails.getUsername()), room);
                    eventRepository.save(event);
                },
                () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "RoomNotFoundException: ",
                            new RoomNotFoundException(eventRequestDTO.getRoomName()));
                }
        );
    }

    @Transactional
    public void changeEvent(EventRequestDTO eventRequestDTO) {
        Optional<Event> eventOptional = eventRepository.findById(eventRequestDTO.getId());
        eventOptional.ifPresentOrElse(
                event -> {
                    event.setEventDate(Date.valueOf(eventRequestDTO.getFormattedDate()));
                    event.setStartEventTime(eventRequestDTO.getStartTime());
                    event.setStopEventTime(eventRequestDTO.getEndTime());
                    event.setEventContent(eventRequestDTO.getDescription());
                    eventRepository.save(event);
                },
                () -> {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "EventNotFoundException: ",
                                                      new EventNotFoundException(eventRequestDTO.getId()));
                }
        );
    }
}
