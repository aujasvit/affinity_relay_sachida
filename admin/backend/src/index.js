import dotenv from "dotenv";
import { app } from "./app.js";
import { pool } from "./db/index.js"
import { Relay } from 'nostr-tools/relay'
import { useWebSocketImplementation } from 'nostr-tools/relay';
import WebSocket from 'ws';

dotenv.config();

useWebSocketImplementation(WebSocket);

let relay = null;

const connectToRelay = async() => {
    try {
    relay = await Relay.connect(process.env.LOCALRELAY)
    console.log(`connected to ${relay.url}`)
    } catch (e) {
        console.warn('Failed to connect to relay', e);
        console.log('Reconnecting in 5 seconds');
        setTimeout(connectToRelay, 5000);
        await connectToRelay();
    }
};

await connectToRelay();

// Encode Uint8Array to Base64
// function encodeUint8Array(array) {
//     return btoa(String.fromCharCode.apply(null, array));
// }

app.listen(process.env.PORT || 2134, '0.0.0.0', () => {
    console.log(`Sever is live at port: ${process.env.PORT}`);
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected to the database');
});

export { relay };