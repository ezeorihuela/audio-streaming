const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let broadcaster;

wss.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("message", (message) => {
        if (!broadcaster) {
            broadcaster = socket;
        }

        wss.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on("close", () => {
        if (socket === broadcaster) {
            broadcaster = null;
        }
    });
});

// Asegurar que Render usa el puerto correcto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en https://audio-streaming.onrender.com`));
