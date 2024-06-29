    const roomSelectButton = document.querySelector('.room-select-btn');
    const roomDropdown = document.querySelector('.room-dropdown');
    const roomList = document.querySelector('.room-list');

    const logoElement = document.querySelector('.wrap-logo .logo');
    let roomStatus;
    let curRoom;

    if (rooms.length === 0) {
        logoElement.textContent = "NoRooms";
        roomStatus = "inactive";
        deleteEventBtn.style.display = 'none';
    } else {
        curRoom = rooms[0];
        logoElement.textContent = curRoom.roomName;
        roomStatus = rooms[0].status;
    }

    rooms.forEach(room => {
      const roomItem = document.createElement('li');
      roomItem.textContent = room.roomName;
      roomItem.addEventListener('click', () => {
        curRoom = room;
        roomStatus = room.status;
        logoElement.textContent = curRoom.roomName;
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

    roomSelectButton.addEventListener('click', () => {
      roomDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.room-selector')) {
        roomDropdown.classList.add('hidden');
      }
    });