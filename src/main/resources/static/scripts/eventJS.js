    const eventContainers = document.querySelectorAll('.events');

    const eventListElement = document.getElementById('eventList');
    const eventList = JSON.parse(eventListElement.getAttribute('data-events'));
    eventListElement.remove();

    const roomListJson = document.getElementById('roomList').dataset.events;
    const rooms = JSON.parse(roomListJson);
    document.getElementById('roomList').remove();
    rooms.sort((a, b) => {
        if (a.roomName < b.roomName) return -1;
        if (a.roomName > b.roomName) return 1;
        return 0;
    });

    const userListJson = document.getElementById('userList').dataset.events;
    const users = JSON.parse(userListJson);
    document.getElementById('userList').remove();
    const UserDict = createUserDictionary(users);

    const curUser = document.getElementById('CurUser').dataset.events;
    document.getElementById('CurUser').remove();

    const idMatch = curUser.match(/id=(\d+)/);
    const roleMatch = curUser.match(/role=(\w+)/);

    const userId = parseInt(idMatch[1]);
    const userRole = roleMatch[1];

    const eventDict = createEventDictionary(eventList, rooms);
    let eventId;

    const rowHeight = 60;

    function createUserDictionary(userListJson)
    {
        return userListJson.reduce((dict, user) => {
            dict[user.id] = user;
            return dict;
        }, {});
    }

    function createEventDictionary(eventList, rooms) {
      const eventDict = {};

      rooms.forEach((room) => {
        eventDict[room.roomName] = {};
      });

      eventList.forEach((event) => {

        const eventDate = new Date(event.eventDate);
        const formattedDate = eventDate.toLocaleDateString().split('.').reverse().join('-');
        const roomName = rooms.find((room) => room.id === event.room.id).roomName;

        if (!eventDict[roomName][formattedDate]) {
          eventDict[roomName][formattedDate] = [];
        }

        const startTime = `${event.startEventTime.hour.toString().padStart(2, '0')}:${event.startEventTime.minute.toString().padStart(2, '0')}`;
        let endTime;
        if (event.stopEventTime.second !== 59) {
            endTime = `${event.stopEventTime.hour.toString().padStart(2, '0')}:${event.stopEventTime.minute.toString().padStart(2, '0')}`;
        } else {endTime = "24:00"}

          eventDict[roomName][formattedDate].push({
              id: event.id,
              eventContent: event.eventContent,
              startEventTime: startTime,
              stopEventTime: endTime,
              user: event.userId,
              room: event.room.id
          });
      });

      return eventDict;
    }

     function createEvent(startTime, endTime, index, eventContent, userEventId, eventid) {
       const startHour = Math.floor(startTime);
       const startMinutes = (startTime - startHour) * 60;
       const endHour = Math.floor(endTime);
       const endMinutes = (endTime - endHour) * 60;

       const startRow = startHour + 1;
       const endRow = endHour + 1;

       const eventElement = document.createElement('div');
       eventElement.classList.add('event');

       eventElement.style.gridRowStart = 1;
       eventElement.style.marginTop = `${(startMinutes / 60) * rowHeight + (startRow - 1) * 60}px`;
       eventElement.style.height = `${((endRow - startRow) + (endMinutes / 60) - (startMinutes / 60)) * rowHeight - 4}px `;
       eventElement.style.backgroundColor = '#ffd6d1';

       eventElement.addEventListener('mouseenter', () => {
           eventElement.style.minHeight = '150px';
           eventElement.style.zIndex = '3';
       });

       eventElement.addEventListener('mouseleave', () => {
           eventElement.style.minHeight = '0px';
           eventElement.style.zIndex = '0';
           eventElement.scrollTop = 0;
       });

       const startTimeString = `${startHour}:${Math.round(startMinutes).toString().padStart(2, '0')}`;
       const endTimeString = `${endHour}:${Math.round(endMinutes).toString().padStart(2, '0')}`;
       eventElement.style.whiteSpace = 'pre-line';
       eventElement.textContent = `Time: ${startTimeString} - ${endTimeString}
                                   Organizer: ${UserDict[userEventId].username}\n
                                   ${eventContent}`;
       eventElement.style.overflow = 'auto';
       eventElement.style.wordBreak = 'break-word';
       if (userId === userEventId || userRole === 'admin') {
           const settingsIcon = document.createElement('i');
           settingsIcon.classList.add('fa', 'fa-cog');

           settingsIcon.addEventListener('click', () => {
               eventElement.style.zIndex = '0';
               const today = new Date();
               const day = new Date(today.getTime() - (today.getDay() - 1 - (currentWeek * 7) - index) * 86400000);
               eventId = eventid;

               openSetModal(day, startTimeString, endTimeString, eventContent);
           });
           eventElement.addEventListener('mouseleave', () => {settingsIcon.style.display = 'none'; });
           eventElement.addEventListener('mouseenter', () => {settingsIcon.style.display = 'block'; });
           eventElement.appendChild(settingsIcon);
           if (userId === userEventId) {eventElement.style.backgroundColor = '#d1ffe6';}
       }

       eventContainers[index].appendChild(eventElement);
     }

    function getEvents(weekOffset) {
      if (rooms.length > 0) {
          for (let i = 0; i < eventContainers.length; i++) {
              const eventContainer = eventContainers[i];
              while (eventContainer.firstChild) {
                  eventContainer.removeChild(eventContainer.firstChild);
              }
          }

          const currentDate = new Date();
          const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(),
              currentDate.getDate() - currentDate.getDay() + (weekOffset * 7));

          const currentWeekEnd = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(),
              currentWeekStart.getDate() + 6);

          const selectedRoomName = curRoom.roomName;

          for (
              let currentDate = new Date(currentWeekStart.getTime());
              currentDate <= currentWeekEnd;
              currentDate.setDate(currentDate.getDate() + 1)
          ) {
              const formattedDate = new Date(currentDate.getTime() + 86400000).toLocaleDateString().split('.').reverse().join('-');
              if (eventDict[selectedRoomName] && eventDict[selectedRoomName][formattedDate]) {
                  eventDict[selectedRoomName][formattedDate].forEach((event) => {
                      const [startHour, startMinute] = event.startEventTime.split(':').map(Number);
                      const [stopHour, stopMinute] = event.stopEventTime.split(':').map(Number);

                      const startEventTime = startHour + startMinute / 60;
                      const stopEventTime = stopHour + stopMinute / 60;

                      createEvent(startEventTime, stopEventTime, currentDate.getDay(), event.eventContent, event.user, event.id);
                  });
              }
          }
      }
    }