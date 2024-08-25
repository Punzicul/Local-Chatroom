let roomsDiv = document.getElementById("roomsDiv");
let roomName = document.getElementById("roomName");
let addRoom = document.getElementById("addRoom");
let roomTitle = document.getElementById("roomTitle");

let screen1 = document.getElementById("screen1")
let screen2 = document.getElementById("screen2")


let messageInput = document.getElementById("messageInput");
let sendMessage = document.getElementById("sendMessage");
let leaveRoom = document.getElementById("leaveRoom");
let title = document.getElementById("roomTitle");
let messages = document.getElementById("messageDiv")

let currentRoom = "";
const socket = io('http://localhost:3000');

function goIntoRoom(name) {
    return null;
}

function addMessage(message, type) {
    let messageDiv = document.createElement("div");
    messageDiv.innerHTML = message;

    if (type === "me") messageDiv.classList.add("myMessage");
    else messageDiv.classList.add("otherMessage");

    messages.appendChild(messageDiv);
}

function loadRoom(roomName) {
    let newRoomDiv = document.createElement("div");
    let newJoinButton = document.createElement("button");
    let newName = document.createElement("p");

    newJoinButton.addEventListener('click', function ()  {
        socket.emit("joinRoom", roomName)
        roomTitle.innerHTML = roomName;
        currentRoom = roomName;

        screen1.style.display = 'none';
        screen2.style.display = 'flex';
    })

    newName.innerHTML = roomName;
    newName.classList.add("roomName");

    newJoinButton.innerHTML = "Join";
    newJoinButton.classList.add("joinRoom");

    newRoomDiv.classList.add("room");

    // Append the name and button to the newRoomDiv
    newRoomDiv.appendChild(newName);
    newRoomDiv.appendChild(newJoinButton);

    // Append the newRoomDiv to the roomsDiv
    roomsDiv.appendChild(newRoomDiv);
}


socket.on('addRoom', (rName) => {
    loadRoom(rName);
});

addRoom.addEventListener('click', function () {
    if (roomName.value.length > 0) {
        socket.emit('addRoom', roomName.value);
        roomName.value = ''; // Clear the input field after adding the room
    }
});

sendMessage.addEventListener("click", function() {
    let message = messageInput.value;

    if (message.length > 0){
        socket.emit("sendMessage", title.innerHTML, message)
        messageInput.value = '';
    }
})

socket.on("loadMessage", (message, type) =>{
    addMessage(message, type);
})

leaveRoom.addEventListener("click", function () {
    screen1.style.display = 'flex';
    screen2.style.display = 'none';
    
    let currentRooms = document.querySelectorAll(".room");
    let currentMessage = document.querySelectorAll(".myMessage");
    let currentMessage2 = document.querySelectorAll(".otherMessage");

    currentRooms.forEach(room => {
        roomsDiv.removeChild(room);
    })

    currentMessage.forEach(message => {
        messages.removeChild(message);
    })
    currentMessage2.forEach(message => {
        messages.removeChild(message);
    })

    socket.emit("leaveRoom", title.innerHTML);
})