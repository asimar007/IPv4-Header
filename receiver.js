const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const PORT = 12345;

socket.bind(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

socket.on('message', (msg, rinfo) => {
    console.log(`Received ${msg} from ${rinfo.address}:${rinfo.port}`);
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
    socket.close();
}); 