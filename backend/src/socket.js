let io;

const initIO = (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        // Join logic: clients join rooms based on their ID
        // Frontend should emit 'join' event with { type: 'user'|'vendor', id: 1 }
        socket.on('join_room', ({ type, id }) => {
            const roomName = `${type}_${id}`;
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined ${roomName}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initIO, getIO };
