package com.example.postgresql.controller;

import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.repository.RoomRepository;
import com.example.postgresql.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import com.example.postgresql.repository.EventRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class Calendar {
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;

    public Calendar(UserRepository userRepository, EventRepository eventRepository, RoomRepository roomRepository) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/calendar")
    public String showCalendar(HttpSession session, Model model) throws JsonProcessingException {
        String username = (String) session.getAttribute("username");
        if (username != null) {

            Iterable<Event> events = eventRepository.findAll();
            model.addAttribute("eventListJson", new ObjectMapper().writeValueAsString(events));

            Iterable<Room> rooms = roomRepository.findAll();
            model.addAttribute("roomListJson", new ObjectMapper().writeValueAsString(rooms));

            model.addAttribute("username", username);
            return "calendar";
        }
        else {
            return "redirect:/login";
        }
    }

}
