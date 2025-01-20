const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const rooms = {}; 

server.on('connection', (socket) => {
    let roomId = null;

    socket.on('message', (data) => {
        const message = JSON.parse(data);

        if (message.type === 'join') {
            roomId = message.roomId;
            const username = message.username;

            rooms[roomId][username] = socket;
            socket.send(JSON.stringify({ message: `Welcome to room: ${roomId}` }));
        } 
        else if (message.type === 'message' && roomId) {
            const { username, content } = message;

            const roomClients = rooms[roomId];
            for (const clientUsername in roomClients) {
                if (clientUsername !== username) {
                    const clientSocket = roomClients[clientUsername];
                    if (clientSocket.readyState === WebSocket.OPEN) {
                        clientSocket.send(JSON.stringify({ username, content }));
                    }
                }
            }
        }
    });

    socket.on('close', () => {
                    delete rooms[roomId][username];
    });
});

console.log('Server is running at 8080');
