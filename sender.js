const raw = require('raw-socket');
const { performance } = require('perf_hooks');

const DESTINATION = '192.168.0.102';
const PORT = 12345;

// DSCP Values
const DSCP_EF = 46 << 2;    // Expedited Forwarding for VoIP
const DSCP_AF41 = 34 << 2;  // Assured Forwarding for Streaming

// Create raw socket
const socket = raw.createSocket({
    protocol: raw.Protocol.UDP,
    addressFamily: raw.AddressFamily.IPv4
});

function sendPacket(data, dscp) {
    const buffer = Buffer.from(data);
    const startTime = performance.now();

    // Set IP header TOS field (DSCP)
    socket.setOption(raw.SocketLevel.IPPROTO_IP, raw.SocketOption.IP_TOS, dscp);

    socket.send(buffer, 0, buffer.length, DESTINATION, (err) => {
        const latency = performance.now() - startTime;
        if (err) {
            console.error(`Error sending packet with DSCP ${dscp >> 2}:`, err);
        } else {
            console.log(`Packet sent with DSCP ${dscp >> 2}. Latency: ${latency.toFixed(2)}ms`);
        }
    });
}

function testLatency() {
    // Send VoIP packet with EF
    sendPacket('VoIP packet', DSCP_EF);

    // Send Streaming packet with AF41
    sendPacket('Streaming packet', DSCP_AF41);
}

// Run test
testLatency();

// Cleanup
setTimeout(() => {
    socket.close();
    console.log('Socket closed.');
}, 5000); 