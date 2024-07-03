package com.example.postgresql.service;

import com.example.postgresql.DTO.RoomDTO;
import com.example.postgresql.model.Room;
import com.example.postgresql.repository.RoomRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class RoomService {
    @PersistenceContext
    private EntityManager entityManager;

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Transactional
    public void saveRoom(HttpSession session, RoomDTO roomDTO) {
        Room room = new Room(roomDTO.getRoomName(), roomDTO.getRoomStatus());
        roomRepository.save(room);
    }

    @Transactional
    public void changeRoom(RoomDTO roomDTO) {
        Optional<Room> roomOptional = roomRepository.findById(roomDTO.getId());
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            room.setRoomName(roomDTO.getRoomName());
            room.setStatus(roomDTO.getRoomStatus());
            roomRepository.save(room);
        } else {
            //Исключение: "Ошибка обновления комнаты"
        }
    }
}
