const modalSet = document.getElementById('setting-event-modal');
const closeBtnSet = document.querySelector('.close-setting-btn-event');
const deleteEventBtn = document.querySelector('.delete-event');
const dateInputSet = document.querySelector('.settings-date-input');
const startTimeInputSet = document.querySelector('.settings-start-time-input');
const endTimeInputSet = document.querySelector('.settings-end-time-input');
const descriptionInputSet = document.querySelector('.settings-description-input');
let roomNameSet = "";
let eventId;

function openSetModal(day, startTimeString, endTimeString, eventContent) {
    roomNameSet = curRoom.roomName;
    modalSet.style.display = 'block';

    const dayMinus = new Date(day);
    dayMinus.setDate(dayMinus.getDate() - 1);
    dayMinus.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    dateInputSet.value = dayMinus.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    startTimeInputSet.value = startTimeString;
    endTimeInputSet.value = endTimeString;
    descriptionInputSet.value = eventContent;

    const [hoursSettingsEventStart, minutesSettingsEventStart] = startTimeString.split(':').map(Number);
    const [hoursSettingsEventStop, minutesSettingsEventStop] = endTimeString.split(':').map(Number);

    const formattedDate = day.toISOString().slice(0, 10);
    const roomEvents = eventDict[roomNameSet][formattedDate]

    for (const event of Object.values(roomEvents)) {
        const [hoursEventStart, minutesEventStart] = event.startEventTime.split(':').map(Number);
        const [hoursEventStop, minutesEventStop] = event.stopEventTime.split(':').map(Number);

        if (hoursSettingsEventStart === hoursEventStart && minutesSettingsEventStart === minutesEventStart &&
            hoursSettingsEventStop === hoursEventStop && minutesSettingsEventStop === minutesEventStop) {
            eventId = event.id;
            break;
        }
    }
}

function closeModal() {
    modalSet.style.display = 'none';
    clearInputFields();
}

function clearInputFields() {
    dateInputSet.value = '';
    startTimeInputSet.value = '';
    endTimeInputSet.value = '';
    descriptionInputSet.value = '';
}

function deleteEvent() {
    fetch('/calendarDeleteEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventId)
    })
        .then(response => {
            if (response.ok) {
                closeModal();
                window.location.href = "/calendar";
            } else {
                alert('Error delete event, bed response');
                window.location.href = "/calendar";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error delete event');
        });
    closeModal();
}

closeBtnSet.addEventListener('click', closeModal);
deleteEventBtn.addEventListener('click', deleteEvent)

window.addEventListener('click', (event) => {
    if (event.target === modalSet) {
        closeModal();
    }
});