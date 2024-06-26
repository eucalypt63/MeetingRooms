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

