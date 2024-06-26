    const roomSelectButton = document.querySelector('.room-select-btn');
    const roomDropdown = document.querySelector('.room-dropdown');
    const roomList = document.querySelector('.room-list');

    const logoElement = document.querySelector('.wrap-logo .logo');

    let selectedRoom = rooms[0].roomName;

    rooms.forEach(room => {
      const roomItem = document.createElement('li');
      roomItem.textContent = room.roomName;
      roomItem.addEventListener('click', () => {
        selectedRoom = room.roomName;
        logoElement.textContent = selectedRoom;
        getEvents(currentWeek);
        roomDropdown.classList.add('hidden');
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