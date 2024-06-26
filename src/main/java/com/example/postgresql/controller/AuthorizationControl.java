package com.example.postgresql.controller;

import com.example.postgresql.model.User;
import com.example.postgresql.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

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

    @PostMapping("/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpSession session) {
        User user = userRepository.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) { //Spring Security: доработать
            session.setAttribute("user", user);
            return "redirect:/calendar";
        } else {
            return "redirect:/login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}