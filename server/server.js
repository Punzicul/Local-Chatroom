const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});

let allRooms = {};
let roomConnections = [];

function reloadRooms(socket) {
    Object.keys(allRooms).forEach(roomName => {
        socket.emit("addRoom", roomName);
    });
}


io.on('connection', socket => {
    roomConnections.push(socket);
    console.log(`Connected: ${socket.id}. Total connections: ${roomConnections.length}`);

    // Send existing rooms to the new connection
    reloadRooms(socket);

    socket.on("addRoom", (roomName) => {
        // Add room if it doesn't already exist
        if (!(roomName in allRooms)) {
            allRooms[roomName] = []; // Or any additional data you want to associate with the room
        }

        // Broadcast the new room to all connected clients
        roomConnections.forEach(currentSocket => {
            currentSocket.emit('addRoom', roomName);
        });
    });

    socket.on('disconnect', () => {
        roomConnections = roomConnections.filter(conn => conn !== socket);
        console.log(`Disconnected: ${socket.id}. Total connections: ${roomConnections.length}`);
    });

    socket.on("joinRoom", (rName) => {
        allRooms[rName].push(socket);
        console.log(allRooms[rName].length)
        roomConnections = roomConnections.filter(item => item !== socket)
        console.log(`ID: ${socket.id} joined "${rName}"`)
    })

    socket.on("sendMessage", (roomName, message) => {
        let allUsersInRoom = allRooms[roomName];

        allUsersInRoom.forEach(user => {
            if (user === socket) {
                user.emit("loadMessage", message, "me")
            }
            else {
                user.emit("loadMessage", message, "other")
            }
        })
    })

    socket.on("leaveRoom", (rName) => {
        allRooms[rName] = allRooms[rName].filter(item => item !== socket);
        roomConnections.push(socket);
        reloadRooms(socket);
        
        console.log(`ID: ${socket.id} left "${rName}"`)
    })
});
