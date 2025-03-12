const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("message", (message) => {
        console.log("Mensaje recibido:", message);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en wss://audio-streaming-jdob.onrender.com`);
});
