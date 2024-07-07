import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  ws.on('message', (message: string) => {
    console.log('Received:', message);
    // Broadcast to everyone else
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send(JSON.stringify({ message: 'Welcome to the WebRTC signaling server' }));
});

console.log('WebSocket server is running on ws://localhost:8080');