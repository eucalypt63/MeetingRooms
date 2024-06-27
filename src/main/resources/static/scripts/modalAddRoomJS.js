const addRoomBtn = document.querySelector('.add-room-btn');
const addRoom = document.querySelector('.add-room');
const roomModal = document.getElementById('add-room-modal');
const closeRoomBtn = document.querySelector('.close-btn-room');
const roomNameInput = document.querySelector('.room-name-input');
const roomStatusDropdown = document.querySelector('.room-status-dropdown');

function openRoomModal() {
    roomModal.style.display = 'block';
}

function closeRoomModal() {
    roomModal.style.display = 'none';
    clearRoomInputFields();
}

function clearRoomInputFields() {
    roomNameInput.value = '';
    roomStatusDropdown.value = '';
}

function addRoomEvent() {
    const roomNameInput = document.querySelector('.room-name-input');
    const roomStatusDropdown = document.querySelector('.room-status-dropdown');

    const roomName = roomNameInput.value;
    const roomStatus = roomStatusDropdown.value;

    if (!roomName || !roomStatus) {
        alert('Fill the empty fields');
        return;
    }

    if(!rooms.some(room => room.name === roomName))
    {
        fetch('/calendarAddRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomName, roomStatus })
        })
            .then(response => {
                if (response.ok) {
                    closeModal(); //Check: добавить вывбод сообщения успешного добавления события
                    window.location.href = "/calendar";
                } else {
                    alert('Error creating room, bed response');
                    window.location.href = "/calendar";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating room');
            });
        closeModal();
    }
    else
    {
        alert('A room with this name already exists');
        return;
    }
    closeRoomModal();
}

addRoomBtn.addEventListener('click', openRoomModal);
closeRoomBtn.addEventListener('click', closeRoomModal);
addRoom.addEventListener('click', addRoomEvent);

window.addEventListener('click', (event) => {
    if (event.target === roomModal) {
        closeRoomModal();
    }
});