// server.ts

import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: string) => {
    console.log('Received:', message);
    // Handle signaling messages for WebRTC

    // Example: Broadcasting signaling messages
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Perform cleanup or notify other clients if needed
  });

  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server' }));
});

console.log('WebSocket server is running on ws://localhost:8080');