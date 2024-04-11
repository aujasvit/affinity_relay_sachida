import dotenv from "dotenv";
import { app } from "./app.js";
import { pool } from "./db/index.js"

dotenv.config();

app.listen(process.env.PORT || 3636, () => {
    console.log(`Sever is live at port: ${process.env.PORT}`);
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
        return;
    }
    console.log('Connected to the database');
});