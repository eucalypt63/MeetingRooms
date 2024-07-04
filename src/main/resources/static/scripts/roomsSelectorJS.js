    const addEventBtnSelect = document.querySelector('.add-event-btn');
    const parentElement = addEventBtn.parentNode;

    const settingsBtns = document.querySelector('.event-settings-buttons');

    const roomSelectButton = document.querySelector('.room-select-btn');
    const roomDropdown = document.querySelector('.room-dropdown');
    const roomList = document.querySelector('.room-list');

    const logoElement = document.querySelector('.wrap-logo .logo');
    let roomStatus;
    let curRoom;

    if (rooms.length === 0) {
        logoElement.textContent = "NoRooms";
        roomStatus = "inactive";
        settingsBtns.remove();
        addEventBtnSelect.remove();
    } else {
        const currentRoomId = parseInt(document.getElementById("currentRoomId").getAttribute("current-room-id"));
        if (currentRoomId === -1) { curRoom = rooms[0]; }
        else {
            curRoom = rooms.find(room => room.id === currentRoomId);
            if (!curRoom) {
                curRoom = rooms[0];
            }
        }

        logoElement.textContent = curRoom.roomName;
        roomStatus = curRoom.status;
        if (roomStatus === "inactive") {
            settingsBtns.remove();
            addEventBtnSelect.remove();
        }
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
              const settingsBtns = document.querySelector('.event-settings-buttons');
              if(settingsBtns) {settingsBtns.remove();}

              const addEventBtnSelect = document.querySelector('.add-event-btn');
              if(addEventBtnSelect) {addEventBtnSelect.remove();}
          }
          else {
              const settingsBtns = document.querySelector('.event-settings-buttons');
              if(!settingsBtns) {
                  const parentElement = document.querySelector('.modal-content-event-set');

                  const eventSettingsButtons = document.createElement('div');
                  eventSettingsButtons.classList.add('event-settings-buttons');

                  const saveChangesButton = document.createElement('button');
                  saveChangesButton.classList.add('save-changes-event');
                  saveChangesButton.textContent = 'Save changes';

                  const deleteEventButton = document.createElement('button');
                  deleteEventButton.classList.add('delete-event');
                  deleteEventButton.textContent = 'Delete Event';

                  deleteEventButton.addEventListener('click', deleteEvent);
                  saveChangesButton.addEventListener('click', saveChangesEvent);

                  eventSettingsButtons.appendChild(saveChangesButton);
                  eventSettingsButtons.appendChild(deleteEventButton);

                  parentElement.appendChild(eventSettingsButtons);
              }

              const addEventBtnSelect = document.querySelector('.add-event-btn');
              if(!addEventBtnSelect) {
                  const newAddEventBtn = document.createElement('a');
                  newAddEventBtn.classList.add('add-event-btn');
                  newAddEventBtn.textContent = 'Add Event';

                  parentElement.insertBefore(addEventBtn, parentElement.firstChild);
              }
          }
          callSave(curRoom.id);
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