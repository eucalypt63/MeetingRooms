    const roomSelectButton = document.querySelector('.room-select-btn');
    const roomDropdown = document.querySelector('.room-dropdown');
    const roomList = document.querySelector('.room-list');

    const logoElement = document.querySelector('.wrap-logo .logo');
    let roomStatus;

    let selectedRoom;
    if (rooms.length === 0) {
        selectedRoom = "NoRooms";
        roomStatus = "inactive";
        deleteEventBtn.style.display = 'none';
    } else {
        selectedRoom = rooms[0].roomName;
        roomStatus = rooms[0].status;
    }

    rooms.forEach(room => {
      const roomItem = document.createElement('li');
      roomItem.textContent = room.roomName;
      roomItem.addEventListener('click', () => {
        selectedRoom = room.roomName;
        roomStatus = room.status;
        logoElement.textContent = selectedRoom;
        getEvents(currentWeek);
        roomDropdown.classList.add('hidden');

          if (roomStatus === "inactive") {
              deleteEventBtn.style.display = 'none';
              addEventBtn.style.display = 'none';
          }
          else {
              deleteEventBtn.style.display = 'block';
              addEventBtn.style.display = 'block';
          }
      });
      roomList.appendChild(roomItem);
    });

    logoElement.textContent = selectedRoom;

    roomSelectButton.addEventListener('click', () => {
      roomDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.room-selector')) {
        roomDropdown.classList.add('hidden');
      }
    });