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

        // Reenvía el audio a todos los clientes excepto el emisor
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
