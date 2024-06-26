    const addEventBtn = document.querySelector('.add-event-btn');
    const modal = document.getElementById('add-event-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addBtn = document.querySelector('.add-btn');
    const dateInput = document.querySelector('.date-input');
    const startTimeInput = document.querySelector('.start-time-input');
    const endTimeInput = document.querySelector('.end-time-input');
    const descriptionInput = document.querySelector('.description-input');

    function openModal() {
      modal.style.display = 'block';
      const today = new Date();

      const currentMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);

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

    function addEvent() {
        const date = dateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const description = descriptionInput.value;

        if (!date || !startTime || !endTime || !description) {
            alert('Fill in the empty fields');
            return;
        }

        const roomName = document.querySelector('.logo').textContent;
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

