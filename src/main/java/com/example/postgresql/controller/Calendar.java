package com.example.postgresql.controller;

import com.example.postgresql.DTO.EventDTO;
import com.example.postgresql.DTO.RoomDTO;
import com.example.postgresql.DTO.UserDTO;
import com.example.postgresql.DTO.WindowDTO;
import com.example.postgresql.model.Event;
import com.example.postgresql.model.Room;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.RoomRepository;
import com.example.postgresql.service.EventService;
import com.example.postgresql.service.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import com.example.postgresql.repository.EventRepository;
import com.example.postgresql.repository.UserRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Controller
public class Calendar {
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RoomRepository roomRepository;
    private final EventService eventService;
    private final RoomService roomService;

    public Calendar(UserRepository userRepository,
                    EventRepository eventRepository,
                    RoomRepository roomRepository,
                    EventService eventService,
                    RoomService roomService) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.eventService = eventService;
        this.roomService = roomService;
    }

    @GetMapping("/calendar")
    public String showCalendar(HttpSession session, Model model) throws JsonProcessingException {
        User curUser = (User) session.getAttribute("user");
        if (curUser != null) {//!!!!!
            Long currentWeek = (Long) session.getAttribute("currentWeek");
            model.addAttribute("currentWeek", currentWeek);

            Long currentRoomId = (Long) session.getAttribute("currentRoomId");
            model.addAttribute("currentRoomId", currentRoomId);

            Iterable<Event> events = eventRepository.findAll();
            model.addAttribute("eventListJson", new ObjectMapper().writeValueAsString(events));

            Iterable<Room> rooms = roomRepository.findAll();
            model.addAttribute("roomListJson", new ObjectMapper().writeValueAsString(rooms));

            UserDTO curUserDTO = new UserDTO(curUser.getId(), curUser.getUsername(), curUser.getRole());
            model.addAttribute("user", curUserDTO);

            Iterable<User> users = userRepository.findAll();
            List<UserDTO> userDTOs= new ArrayList<>();
            for (User user : users) { userDTOs.add(new UserDTO(user.getId(), user.getUsername(), user.getRole())); }
            model.addAttribute("userListJson", new ObjectMapper().writeValueAsString(userDTOs));

            return "calendar";
        }
        else {
            return "redirect:/login";
        }
    }

    @PostMapping("/calendarAddEvent")
    public ResponseEntity<Void> createEvent(HttpSession session, @RequestBody EventDTO eventDTO) {
        System.out.println(eventDTO);
        eventService.saveEvent(session, eventDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/calendarAddRoom")
    public ResponseEntity<Void> createRoom(@RequestBody RoomDTO roomDTO) {
        roomService.saveRoom(roomDTO);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("/calendarDeleteEvent")
    public ResponseEntity<Void> deleteEvent(@RequestBody Long eventId) {
        eventRepository.deleteById(eventId);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("/calendarDeleteRoom")
    public ResponseEntity<Void> deleteRoom(@RequestBody RoomDTO roomDTO) {
        roomRepository.deleteById(roomDTO.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/calendarChangesRoom")
    public ResponseEntity<Void> changeRoom(@RequestBody RoomDTO roomDTO) {
        roomService.changeRoom(roomDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/calendarChangesEvent")
    public ResponseEntity<Void> changeEvent(@RequestBody EventDTO eventDTO) {
        System.out.println(eventDTO);

        eventService.changeEvent(eventDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/saveWindowDate")
    public ResponseEntity<Void> saveWindowDate(HttpSession session,  @RequestBody WindowDTO window) {
        session.setAttribute("currentWeek", window.getCurrentWeek());
        session.setAttribute("currentRoomId", window.getCurrentRoomId());
        return ResponseEntity.ok().build();
    }
}
