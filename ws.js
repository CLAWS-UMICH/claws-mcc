const WebSocket = require('ws');

// const serverUrl = 'ws://localhost:8000/hololens';
const serverUrl = 'wss://claws-lmcc.loca.lt/hololens';

const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
    console.log('Connected to WebSocket server');

    ws.send('ping');
});

ws.on('message', function incoming(message) {
    console.log('Received message:', message);
});

ws.on('close', function close() {
    console.log('Disconnected from WebSocket server');
});

ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
});