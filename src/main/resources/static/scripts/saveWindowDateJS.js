function saveWindowDate(currentWeek, currentRoomId){
    console.log(currentWeek);
    console.log(currentRoomId);
    fetch('/saveWindowDate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentWeek, currentRoomId })
    })
        .then(response => {
            if (!response.ok) { alert('Error save window date, bed response'); }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error save window date');
        });
}

function callSave(currentRoomId){
    saveWindowDate(currentWeek, currentRoomId);
}
