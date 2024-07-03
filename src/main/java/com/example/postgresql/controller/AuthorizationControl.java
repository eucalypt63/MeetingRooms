package com.example.postgresql.controller;

import com.example.postgresql.exception.RoomNotFoundException;
import com.example.postgresql.exception.UserNotFoundException;
import com.example.postgresql.model.User;
import com.example.postgresql.repository.UserRepository;
import lombok.SneakyThrows;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

@Controller
public class AuthorizationControl {
    private final UserRepository userRepository;

    public AuthorizationControl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/login")
    public String getAuthorization(Model model) {
        return "login";
    }

    @SneakyThrows
    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpSession session) {
        Optional<User> user = Optional.ofNullable(userRepository.findByUsername(username));//Spring Security: доработать
        AtomicBoolean redirect = new AtomicBoolean(false);
        if (user.isPresent()){
            User u = user.get();
            if (u.getPassword().equals(password)) {
                session.setAttribute("currentWeek", 0L);
                session.setAttribute("currentRoomId", -1L);
                session.setAttribute("user", u);
                return "redirect:/calendar";
            }
        }
        else{
            throw new UserNotFoundException(username);
        }
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}