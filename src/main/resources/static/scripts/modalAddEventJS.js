    const addEventBtn = document.querySelector('.add-event-btn');
    const modal = document.getElementById('add-event-modal');
    const closeBtn = document.querySelector('.close-btn-event');
    const addBtn = document.querySelector('.add-event');
    const dateInput = document.querySelector('.date-input');
    const startTimeInput = document.querySelector('.start-time-input');
    const endTimeInput = document.querySelector('.end-time-input');
    const descriptionInput = document.querySelector('.description-input');
    let roomName = "";

    function openModal() {
      roomName = selectedRoom;
      modal.style.display = 'block';
      const today = new Date();

      const currentMonday = new Date(today.getFullYear(), today.getMonth(),
                                                    today.getDate() - today.getDay() + 1 + currentWeek * 7);

      const formattedDate = currentMonday.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      }).replace(/\./g, '.');

      const dateInput = document.querySelector('.date-input');
      dateInput.value = formattedDate;
    }

    function closeModal() {
      modal.style.display = 'none';
      clearInputFields();
    }

    function clearInputFields() {
      dateInput.value = '';
      startTimeInput.value = '';
      endTimeInput.value = '';
      descriptionInput.value = '';
    }

    //Слишком объёмная функция, нужно разделить (╯▔皿▔)╯
    function addEvent() {
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const description = descriptionInput.value;

        if (!date || !startTime || !endTime || !description) {
            alert('Fill the empty fields');
            return;
        }

        const dateFormat = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!dateFormat.test(date)) {
            alert('Invalid date format: dd.mm.yyyy');
            return;
        }

        const timeFormat = /^(([0-1]?[0-9]|2[0-3]):([0-5][0-9]))|24:00$/;
        if (!timeFormat.test(startTime) || !timeFormat.test(endTime)) {
            alert('Invalid time format: h:mm или hh:mm');
            return;
        }

        const [day, month, year] = date.split('.');
        const formattedDate = `${year}-${month}-${day}`;

        const startTimeParts = startTime.split(':');
        const endTimeParts = endTime.split(':');
        const startDateTime = new Date(`${formattedDate} ${startTimeParts[0]}:${startTimeParts[1]}`);
        const endDateTime = new Date(`${formattedDate} ${endTimeParts[0]}:${endTimeParts[1]}`);

        if (startDateTime >= endDateTime || (endDateTime.getTime() - startDateTime.getTime()) < 30 * 60 * 1000) {
            alert('Minimum event time - 30 minutes');
            return;
        }

        if (eventDict[roomName] && eventDict[roomName][formattedDate]) {
            for (const event of eventDict[roomName][formattedDate]) {
                const eventStartDateTime = new Date(`${formattedDate} ${event.startEventTime}`);
                const eventEndDateTime = new Date(`${formattedDate} ${event.stopEventTime}`);
                if (
                    (startDateTime >= eventStartDateTime && startDateTime < eventEndDateTime) ||
                    (endDateTime > eventStartDateTime && endDateTime <= eventEndDateTime) ||
                    (startDateTime <= eventStartDateTime && endDateTime >= eventEndDateTime)
                ) {
                    alert('Your event overlaps an existing event');
                    return;
                }
            }
        }

        fetch('/calendarAddEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formattedDate, startTime, endTime, description, roomName })
        })
            .then(response => {
                if (response.ok) {
                    closeModal();
                    window.location.href = "/calendar";
                } else {
                    alert('Error creating event, bed response');
                    window.location.href = "/calendar";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating event');
            });
        closeModal();
    }

    addEventBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    addBtn.addEventListener('click', addEvent);

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });