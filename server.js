
const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connections = [];

wss.on("connection", function connection(ws) {
  connections.push(ws);

  ws.on("message", function incoming(message) {
    // Broadcast message to all connected clients
    connections.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", function () {
    connections = connections.filter(conn => conn !== ws);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
  console.log(`WebSocket server is running on port ${PORT}`);
});
