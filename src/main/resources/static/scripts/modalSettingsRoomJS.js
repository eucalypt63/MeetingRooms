const setRoomBtn = document.querySelector('.logo');
const modalRoomSet = document.getElementById('setting-room-modal');
const closeRoomBtnSet = document.querySelector('.close-setting-btn-room');
const deleteRoomBtn = document.querySelector('.delete-room')
const saveRoomChangesBtn = document.querySelector('.save-changes-room');
const roomNameInputSet = document.querySelector('.room-setting-name-input');
const roomStatusSet = document.querySelector('.room-setting-status-dropdown');
let curRoomSet;

function openRoomSetModal( ) {
    curRoomSet = curRoom;
    modalRoomSet.style.display = 'block';
    roomNameInputSet.value = curRoomSet.roomName;
    roomStatusSet.value = curRoomSet.status;
}

function closeRoomSetModal() {
    modalRoomSet.style.display = 'none';
    clearInputFields();
}

function clearInputFields() {
    roomNameInputSet.value = '';
    roomStatusSet.value = '';
}

function deleteRoom() {
    console.log(curRoomSet);
    fetch('/calendarDeleteRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(curRoomSet)
    })
        .then(response => {
            if (response.ok) {
                closeRoomSetModal();
                window.location.href = "/calendar";
            } else {
                alert('Error delete room, bed response');
                window.location.href = "/calendar";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error delete room');
        });
    closeRoomSetModal();
}

function saveChangesRoom() {
    const id = curRoomSet.id;
    const roomName = curRoomSet.roomName;
    const roomStatus = roomStatusSet.value;
    fetch('/calendarChangesRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, roomName, roomStatus })
    })
        .then(response => {
            if (response.ok) {
                closeRoomSetModal();
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
    closeRoomSetModal();
}

if(userRole === "admin" && rooms.length !== 0) {
    setRoomBtn.addEventListener('click', openRoomSetModal);
    closeRoomBtnSet.addEventListener('click', closeRoomSetModal);
    deleteRoomBtn.addEventListener('click', deleteRoom)
    saveRoomChangesBtn.addEventListener('click', saveChangesRoom)
    setRoomBtn.style.cursor = "pointer";
}

window.addEventListener('click', (event) => {
    if (event.target === modalRoomSet) {
        closeRoomSetModal();
    }
});