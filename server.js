const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.static('public'));

let broadcaster;

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        if (message === "broadcaster") {
            broadcaster = socket;
        } else if (broadcaster && broadcaster.readyState === WebSocket.OPEN) {
            broadcaster.send(message);
        }
    });
    
    socket.on("close", () => {
        if (socket === broadcaster) {
            broadcaster = null;
        }
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`));