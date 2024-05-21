import { useWebSocketImplementation } from 'nostr-tools/relay';
import WebSocket from 'ws';
import pg from 'pg';

useWebSocketImplementation(WebSocket);

const { Pool } = pg;

const pool = new Pool({
    user: 'nostr_ts_relay',
    password: 'nostr_ts_relay',
    host: '0.0.0.0',
    port: 5432,
    database: 'nostr_ts_relay',
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected to the database');
});

// we will define our function here

export default async function handleifresponse(message) {
    const { event } = message;
    const { kind } = event;
    if(!kind) return 0;
    if(!(kind >= 11030 && kind < 11050)) return -1;
    
}