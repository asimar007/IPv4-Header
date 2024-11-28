const dgram = require('dgram');
const { performance } = require('perf_hooks');

// VoIP and Streaming DSCP simulation (For demonstration)
const DSCP_VOIP = 46; // VoIP DSCP value (Expedited Forwarding)
const DSCP_STREAMING = 26; // Streaming DSCP value (Assured Forwarding)
const DESTINATION = '192.168.0.101'; // Replace with a valid destination IP
const PORT = 12345;

// Create UDP socket for communication
const socket = dgram.createSocket('udp4');

// Simulate sending VoIP traffic (high priority)
function sendVoIPTraffic() {
    const message = Buffer.from('VoIP packet');
    const startTime = performance.now();

    // Artificial delay for simulation
    setTimeout(() => {
        socket.send(message, PORT, DESTINATION, (err) => {
            const latency = performance.now() - startTime;
            if (err) {
                console.error('Error sending VoIP packet:', err);
            } else {
                console.log(`VoIP packet sent to ${DESTINATION}. Latency: ${latency.toFixed(2)}ms`);
            }
        });
    }, 500); // Simulate delay in VoIP packet sending
}

// Simulate sending Streaming traffic (lower priority)
function sendStreamingTraffic() {
    const message = Buffer.from('Streaming packet');
    const startTime = performance.now();
    socket.send(message, PORT, DESTINATION, (err) => {
        const latency = performance.now() - startTime;
        if (err) {
            console.error('Error sending Streaming packet:', err);
        } else {
            console.log(`Streaming packet sent to ${DESTINATION}. Latency: ${latency.toFixed(2)}ms`);
        }
    });
}

// Simulate a network with VoIP priority followed by Streaming
function simulateNetworkTraffic() {
    // First, simulate high-priority VoIP traffic with artificial delay
    sendVoIPTraffic();

    // Then, simulate lower-priority Streaming traffic
    setTimeout(() => {
        sendStreamingTraffic();
    }, 1000); // Simulate delay between sending different traffic types
}

// Start simulation
simulateNetworkTraffic();

// Cleanup when done
setTimeout(() => {
    socket.close();
    console.log('Socket closed.');
}, 5000); // Close socket after 5 seconds
