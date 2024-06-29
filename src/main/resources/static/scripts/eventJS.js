    const eventContainers = document.querySelectorAll('.events');

    const eventListElement = document.getElementById('eventList');
    const eventList = JSON.parse(eventListElement.getAttribute('data-events'));
    eventListElement.remove();

    const roomListJson = document.getElementById('roomList').dataset.events;
    const rooms = JSON.parse(roomListJson);
    document.getElementById('roomList').remove();

    const userListJson = document.getElementById('userList').dataset.events;
    const users = JSON.parse(userListJson);
    document.getElementById('userList').remove();
    const UserDict = createUserDictionary(users);

    const curUserJson = document.getElementById('CurUser').dataset.events;
    document.getElementById('CurUser').remove();

    const eventDict = createEventDictionary(eventList, rooms);

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
        eventDate.setDate(eventDate.getDate() + 1);

        const formattedDate = eventDate.toISOString().slice(0, 10);
        const roomId = event.roomId;

        const roomName = rooms.find((room) => room.id === roomId).roomName;

        if (!eventDict[roomName][formattedDate]) {
          eventDict[roomName][formattedDate] = [];
        }

        eventDict[roomName][formattedDate].push(event);
      });

      return eventDict;
    }

     function createEvent(startTime, endTime, index, eventContent, userId) {
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
       eventElement.style.backgroundColor = getRandomEventColor();//!!!!!!!

       eventElement.addEventListener('mouseenter', () => {
           eventElement.style.minHeight = '150px';
           eventElement.style.zIndex = '100';
           settingsIcon.style.display = 'block';
       });

       eventElement.addEventListener('mouseleave', () => {
           eventElement.style.minHeight = '0px';
           eventElement.style.zIndex = '0';
           settingsIcon.style.display = 'none';
       });

         const startTimeString = `${startHour}:${Math.round(startMinutes).toString().padStart(2, '0')}`;
         const endTimeString = `${endHour}:${Math.round(endMinutes).toString().padStart(2, '0')}`;


       eventElement.style.whiteSpace = 'pre-line';
       eventElement.textContent = `Time: ${startTimeString} - ${endTimeString}
                                   Organizer: ${UserDict[userId].username}\n
                                   ${eventContent}`;
       eventElement.style.overflow = 'auto';
       eventElement.style.wordBreak = 'break-word';

       const settingsIcon = document.createElement('i');
       settingsIcon.classList.add('fa', 'fa-cog');
       settingsIcon.addEventListener('click', () => {
           eventElement.style.zIndex = '0';
           const today = new Date();
           const day = new Date(today.getTime() - (today.getDay() - 2 - (currentWeek * 7) - index) * 86400000);

           openSetModal(day, startTimeString, endTimeString, eventContent);
       });

       eventElement.appendChild(settingsIcon);
       eventContainers[index].appendChild(eventElement);
     }

     function getRandomEventColor() {
       const colors = ['#ffd6d1', '#fafaa3', '#e2f8ff', '#d1ffe6'];
       const randomIndex = Math.floor(Math.random() * colors.length);
       return colors[randomIndex];
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
              currentDate.getDate() - currentDate.getDay() + (weekOffset * 7) + 1);

          const currentWeekEnd = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(),
              currentWeekStart.getDate() + 6);

          const selectedRoomName = curRoom.roomName;

          for (
              let currentDate = new Date(currentWeekStart.getTime());
              currentDate <= currentWeekEnd;
              currentDate.setDate(currentDate.getDate() + 1)
          ) {
              const formattedDate = new Date(currentDate.getTime() + 86400000).toISOString().slice(0, 10);
              if (eventDict[selectedRoomName] && eventDict[selectedRoomName][formattedDate]) {
                  eventDict[selectedRoomName][formattedDate].forEach((event) => {
                      const [startHour, startMinute] = event.startEventTime.split(':').map(Number);
                      const [stopHour, stopMinute] = event.stopEventTime.split(':').map(Number);

                      const startEventTime = startHour + startMinute / 60;
                      const stopEventTime = stopHour + stopMinute / 60;

                      createEvent(startEventTime, stopEventTime, currentDate.getDay() - 1, event.eventContent, event.userId);
                  });
              }
          }
      }
    }