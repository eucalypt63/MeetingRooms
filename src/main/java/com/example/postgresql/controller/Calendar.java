package com.example.postgresql.controller;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.DTO.RoomDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.RoomRepository;
import com.example.postgresql.repository.UserRepository;
import com.example.postgresql.service.EventService;
import com.example.postgresql.service.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.example.postgresql.repository.EventRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpSession;

@Controller
public class Calendar {
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;
    private final EventService eventService;
    private final RoomService roomService;

    public Calendar(EventRepository eventRepository,
                    RoomRepository roomRepository,
                    EventService eventService,
                    RoomService roomService) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.eventService = eventService;
        this.roomService = roomService;
    }

    @GetMapping("/calendar")
    public String showCalendar(HttpSession session, Model model) throws JsonProcessingException {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            Iterable<Event> events = eventRepository.findAll();
            model.addAttribute("eventListJson", new ObjectMapper().writeValueAsString(events));

            Iterable<Room> rooms = roomRepository.findAll();
            model.addAttribute("roomListJson", new ObjectMapper().writeValueAsString(rooms));

            model.addAttribute("user", user);
            return "calendar";
        }
        else {
            return "redirect:/login";
        }
    }

    @PostMapping("/calendarAddEvent")
    public ResponseEntity<Void> createEvent(HttpSession session, @RequestBody EventDTO eventDTO) {
        eventService.saveEvent(session, eventDTO);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/calendarAddRoom")
    public ResponseEntity<Void> createRoom(HttpSession session, @RequestBody RoomDTO roomDTO) {
        roomService.saveEvent(session, roomDTO);

        return ResponseEntity.ok().build();
    }

}
