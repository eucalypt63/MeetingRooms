const modalSet = document.getElementById('setting-event-modal');
const closeBtnSet = document.querySelector('.close-setting-btn-event');
const deleteEventBtn = document.querySelector('.delete-event');
const dateInputSet = document.querySelector('.settings-date-input');
const startTimeInputSet = document.querySelector('.settings-start-time-input');
const endTimeInputSet = document.querySelector('.settings-end-time-input');
const descriptionInputSet = document.querySelector('.settings-description-input');
const saveEventChangesBtn = document.querySelector('.save-changes-event');
let roomNameSet = "";

function openSetModal(day, startTimeString, endTimeString, eventContent) {
    roomNameSet = curRoom.roomName;
    modalSet.style.display = 'block';

    dateInputSet.value = day.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    startTimeInputSet.value = startTimeString;
    endTimeInputSet.value = endTimeString;
    descriptionInputSet.value = eventContent;
}

function closeEventSetModal() {
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
                closeEventSetModal();
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
    closeEventSetModal();
}

function saveChangesEvent() {
    const id = eventId;
    const date = dateInputSet.value;
    let startTime = startTimeInputSet.value;
    let endTime = endTimeInputSet.value;
    const description = descriptionInputSet.value;
    const roomName = roomNameSet;

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
    let formattedDate = `${year}-${month}-${day}`;

    const startTimeParts = startTime.split(':');
    const endTimeParts = endTime.split(':');
    const startDateTime = new Date(`${formattedDate} ${startTimeParts[0]}:${startTimeParts[1]}`);
    const endDateTime = new Date(`${formattedDate} ${endTimeParts[0]}:${endTimeParts[1]}`);

    if (startDateTime >= endDateTime || (endDateTime.getTime() - startDateTime.getTime()) < 30 * 60 * 1000) {
        alert('Minimum event time - 30 minutes');
        return;
    }
    console.log(formattedDate);
    if (eventDict[roomName] && eventDict[roomName][formattedDate]) {
        for (const event of eventDict[roomName][formattedDate]) {
            const eventStartDateTime = new Date(`${formattedDate} ${event.startEventTime}`);
            const eventEndDateTime = new Date(`${formattedDate} ${event.stopEventTime}`);
            if (event.id !== id) {
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
    }
    startTime = startTime.padStart(5, '0') + ':00';
    endTime = endTime.padStart(5, '0') + ':00';
    fetch('/calendarChangesEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, formattedDate, startTime, endTime, description, roomName })
    })
        .then(response => {
            if (response.ok) {
                closeEventSetModal();
                window.location.href = "/calendar";
            } else {
                alert('Error change room, bed response');
                window.location.href = "/calendar";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error change room');
        });
    closeEventSetModal();
}

closeBtnSet.addEventListener('click', closeEventSetModal);
deleteEventBtn.addEventListener('click', deleteEvent);
saveEventChangesBtn.addEventListener('click', saveChangesEvent);

window.addEventListener('click', (event) => {
    if (event.target === modalSet) {
        closeEventSetModal();
    }
});