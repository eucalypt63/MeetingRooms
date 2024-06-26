    const eventContainers = document.querySelectorAll('.events');

    const eventListElement = document.getElementById('eventList');
    const eventList = JSON.parse(eventListElement.getAttribute('data-events'));

    const roomListJson = document.getElementById('roomList').dataset.events;
    const rooms = JSON.parse(roomListJson);

    const eventDict = createEventDictionary(eventList, rooms);

    const rowHeight = 60;

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

     function createEvent(startTime, endTime, index, eventContent) {
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
       eventElement.style.height = `${((endRow - startRow) + (endMinutes / 60) - (startMinutes / 60)) * rowHeight - 5}px `;
       eventElement.style.backgroundColor = getRandomEventColor();//!!!!!!!1

       eventElement.addEventListener('mouseenter', () => {eventElement.style.minHeight = '150px';});

       eventElement.addEventListener('mouseleave', () => {eventElement.style.minHeight = '0px';});

       const startTimeString = `${startHour.toString().padStart(2, '0')}:${Math.round(startMinutes * 100)
                       / 100 < 10 ? '0' + Math.round(startMinutes * 100) / 100 : Math.round(startMinutes * 100) / 100}`;
       const endTimeString = `${endHour.toString().padStart(2, '0')}:${Math.round(endMinutes * 100)
                        / 100 < 10 ? '0' + Math.round(endMinutes * 100) / 100 : Math.round(endMinutes * 100) / 100}`;

       eventElement.style.whiteSpace = 'pre-line';
       eventElement.textContent = `${startTimeString} - ${endTimeString}\n${eventContent}`;
       eventElement.style.overflow = 'auto';
       eventElement.style.wordBreak = 'break-word';

       eventContainers[index].appendChild(eventElement);
     }

     function getRandomEventColor() {
       const colors = ['#ffd6d1', '#fafaa3', '#e2f8ff', '#d1ffe6'];
       const randomIndex = Math.floor(Math.random() * colors.length);
       return colors[randomIndex];
     }

    function getEvents(weekOffset) {
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

      const selectedRoomName = document.querySelector('.wrap-logo .logo').textContent.trim();

      for (
        let currentDate = new Date(currentWeekStart.getTime());
        currentDate <= currentWeekEnd;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const formattedDate = new Date(currentDate.getTime() + 86400000 ).toISOString().slice(0, 10);
        if (eventDict[selectedRoomName] && eventDict[selectedRoomName][formattedDate]) {
          eventDict[selectedRoomName][formattedDate].forEach((event) => {
            const [startHour, startMinute] = event.startEventTime.split(':').map(Number);
            const [stopHour, stopMinute] = event.stopEventTime.split(':').map(Number);

            const startEventTime = startHour + startMinute / 60;
            const stopEventTime = stopHour + stopMinute / 60;

            createEvent(startEventTime, stopEventTime, currentDate.getDay() - 1, event.eventContent);
          });
        }
      }
      eventListElement.remove();
    }