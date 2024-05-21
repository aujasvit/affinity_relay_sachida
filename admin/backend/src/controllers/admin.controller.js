import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { pool } from "../db/index.js";
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { relay } from "../index.js";

dotenv.config({ path: "././.env" });

const pubkey = process.env.PUBKEY;
const signature = process.env.SIGNATURE;

// Decode Base64 to Uint8Array
function decodeBase64(base64String) {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

const sk = decodeBase64(process.env.SECRETKEY);
const pk = process.env.PUBLICKEY;

const setupRelay = asyncHandler(async (req, res) => {
    const dbname = "events";

    const { connectionURL, name, longitude, latitude, address, email, phone, mobile} = req.body;
    const contact = { email, phone:phone?phone:"", mobile:mobile?mobile:""};

    console.log(req.body);

    if(!connectionURL || !name || !longitude || !latitude || !address || !contact) {
        return res.status(400).json(new ApiError(400, "Some required fields are empty"));
    }

    const query = {
        text: `SELECT * FROM ${dbname}
               WHERE event_kind = $1
               LIMIT 1`,
        values: [11000],
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (user) {
        const query = {
        text: `DELETE FROM ${dbname}
               WHERE event_kind = $1`,
        values: [11000],
        };

        await pool.query(query);
    }

    let eventTemplate = {
        kind: 11000,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({connectionURL, name, longitude, latitude, address, contact}),
    }
    
    const signedEvent = finalizeEvent(eventTemplate, sk)
    await relay.publish(signedEvent);

    return res.status(200).json(new ApiResponse(200, "Relay setup successfully"));

});

const getRelay = asyncHandler(async (req, res) => {
    const dbname = "events";

    const query = {
        text: `SELECT * FROM events WHERE event_kind = 11000 LIMIT 1`
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (user) {
        return res.status(200).json(new ApiResponse(200, user));
    } else {
        throw new ApiError(401, "Relay not found");
    }
});

const addMerchant = asyncHandler(async (req, res) => {
    const dbname = "merchants";

    const tableExistsQuery = {
        text: `SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = $1
        );`,
        values: [dbname],
    };

    const tableExistsResult = await pool.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0].exists;

    if (!tableExists) {
        const createTableQuery = {
            text: `CREATE TABLE ${dbname} (
                id TEXT NOT NULL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                longitude FLOAT NOT NULL,
                latitude FLOAT NOT NULL,
                pricing TEXT NOT NULL,
                contact TEXT NOT NULL,
                shortdes TEXT NOT NULL,
                status BOOL NOT NULL
            );`,
        };

        try {
            await pool.query(createTableQuery);
        } catch (error) {
            throw new ApiError(500, `Unable to create ${dbname} table`, error);
        }
    }

    const { id, name, longitude, latitude, pricing, contact, shortdes } =
        req.body;
    let { status } = req.body;

    if (
        !id ||
        !name ||
        !longitude ||
        !latitude ||
        !pricing ||
        !contact ||
        !shortdes ||
        !status ||
        !pubkey ||
        !signature
    ) {
        throw new ApiError(400, "Some fields are empty");
    }

    status = status.toLowerCase();

    const query = {
        text: `SELECT * FROM ${dbname}
               WHERE id = $1
               LIMIT 1;`,
        values: [id],
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (user) {
        res.status(500).json(new ApiError(500, "Merchant with this id already in the database"));
    }

    const insertQuery = {
        text: `INSERT INTO ${dbname} (
                  id,
                  name,
                  longitude,
                  latitude,
                  pricing,
                  contact,
                  shortdes,
                  status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [
            parseInt(id),
            name,
            parseFloat(longitude),
            parseFloat(latitude),
            pricing,
            contact,
            shortdes,
            status == "active" ? true : false,
        ],
    };

    try {
        const newUserResult = await pool.query(insertQuery);
    } catch (error) {
        res.status(500).json(new ApiResponse(500, "Merchant created but unable to insert into database"));
    }

    const eventquery = {
        text: `SELECT * FROM events
               WHERE event_kind = $1
               LIMIT 1;`,
        values: [11002],
    };

    const eventresult = await pool.query(eventquery);
    const event = eventresult.rows[0];

    const nMerchant = {
        id: id,
        name: name,
        longitude: longitude,
        latitude: latitude,
        pricing: pricing,
        contact: contact,
        shortdes: shortdes,
        status: status == "active" ? true : false,
    };

    if (!event) {
        const merchaantObj = {};
        merchaantObj[id] = nMerchant;

        let eventTemplate = {
            kind: 11002,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify(merchaantObj),
        }
        
        const signedEvent = finalizeEvent(eventTemplate, sk)
        await relay.publish(signedEvent);

        // const insertQuery = {
        //     text: `INSERT INTO events (
        //               event_id,
        //               event_kind,
        //               event_content,
        //               event_created_at,
        //               event_pubkey,
        //               event_signature,
        //               event_tags
        //             ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        //     values: [
        //         "evid",
        //         11002,
        //         JSON.stringify(merchaantObj),
        //         parseInt(new Date().getTime() / 1000),
        //         pubkey,
        //         signature,
        //         "[]",
        //     ],
        // };

        // try {
        //     const newUserResult = await pool.query(insertQuery);
        // } catch (error) {
        //     console.log(error);
        //     throw new ApiError(
        //         500,
        //         `unable to update merchant event in database`,
        //         error
        //     );
        // }
    } else {
        const allmerchants = JSON.parse(event.event_content);
        allmerchants[id] = nMerchant;

        const updateQuery = {
            text: `UPDATE events
            SET event_kind = $1
            WHERE id = $2`,
            values: [11012, event.id],
        };
        
        try {
            const newUserResult = await pool.query(updateQuery);
        } catch (error) {
            console.log(error);
            throw new ApiError(
                500,
                `unable to update merchant event in database`,
                error
            );
        }
        
        let eventTemplate = {
            kind: 11002,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: JSON.stringify(allmerchants),
        }

        let sk = generateSecretKey()
        
        const signedEvent = finalizeEvent(eventTemplate, sk)
        await relay.publish(signedEvent);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                202,
                { msg: `${dbname} created successfully` },
                `New ${dbname} added`
            )
        );
});

const deleteMerchant = asyncHandler(async (req, res) => {
    const dbname = "merchants";

    const { id } = req.body;

    if (!id || !pubkey || !signature) {
        throw new ApiError(400, "Some fields are empty");
    }

    const query = {
        text: `SELECT * FROM ${dbname}
               WHERE id = $1
               LIMIT 1;`,
        values: [id],
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (!user) {
        return res.status(403).json(new ApiError(403, `merchanat with id ${id} is not in database`));
    }

    const deleteQuery = {
        text: `DELETE FROM ${dbname}
               WHERE id = $1`,
        values: [id],
    };

    try {
        const deleteResult = await pool.query(deleteQuery);
    } catch (error) {
        return res.status(500).json(new ApiError(
            500,
            `unable to delete ${dbname} from database`,
            error
        ));
    }

    const eventquery = {
        text: `SELECT * FROM events
               WHERE event_kind = $1
               LIMIT 1;`,
        values: [11002],
    };

    const eventresult = await pool.query(eventquery);
    const event = eventresult.rows[0];

    let allmerchants = JSON.parse(event.event_content);
    delete allmerchants[id];

    const updateQuery = {
        text: `UPDATE events
                SET event_content = $1,
                event_pubkey = $2,
                event_signature = $3
                WHERE event_kind = $4`,
        values: [JSON.stringify(allmerchants), pubkey, signature, 11002],
    };

    try {
        const newUserResult = await pool.query(updateQuery);
    } catch (error) {
        return res(500).json(new ApiError(
            500,
            `merchant deleted but, unable to update merchant event in database`,
            error
        ));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                202,
                { msg: `merchant with id ${id} deleted successfully` },
                `merchant deleted`
            )
        );
});

const updateMerchant = asyncHandler(async (req, res) => {
    const dbname = "merchants";

    console.log(req.body);

    const {
        id,
        name,
        longitude,
        latitude,
        pricing,
        contact,
        shortdes,
    } = req.body;

    let status = req.body.status;
    status = status.toLowerCase();

    if (
        !id ||
        !name ||
        !longitude ||
        !latitude ||
        !pricing ||
        !contact ||
        !shortdes ||
        !status ||
        !pubkey ||
        !signature
    ) {
        return res.status(400).json(new ApiError(400, "Some fields are empty"));
    }

    const query = {
        text: `SELECT * FROM ${dbname}
               WHERE id = $1
               LIMIT 1;`,
        values: [id],
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (!user) {
        return res.status(403).json(new ApiError(403, `merchant with id ${id} is not in database`));
    }

    const updateQuery = {
        text: `UPDATE ${dbname}
                SET name = $1,
                longitude = $2,
                latitude = $3,
                pricing = $4,
                contact = $5,
                shortdes = $6,
                status = $7
                WHERE id = $8`,
        values: [
            name,
            longitude,
            latitude,
            pricing,
            contact,
            shortdes,
            status == "active" ? true : false,
            id,
        ],
    };

    try {
        const updateResult = await pool.query(updateQuery);
    } catch (error) {
        return res.status(500).json(new ApiError(
            500,
            `unable to update ${dbname} in database`,
            error
        ));
    }

    const eventquery = {
        text: `SELECT * FROM events
               WHERE event_kind = $1
               LIMIT 1;`,
        values: [11002],
    };

    const eventresult = await pool.query(eventquery);
    const event = eventresult.rows[0];

    const nMerchant = {
        id: id,
        name: name,
        longitude: longitude,
        latitude: latitude,
        pricing: pricing,
        contact: contact,
        shortdes: shortdes,
        status: status == "active" ? true : false,
    };

    let allmerchants = JSON.parse(event.event_content);
    allmerchants[id] = nMerchant;

    const updateQuery2 = {
        text: `UPDATE events
                    SET event_content = $1,
                    event_pubkey = $2,
                    event_signature = $3
                    WHERE event_kind = $4`,
        values: [JSON.stringify(allmerchants), pubkey, signature, 11002],
    };

    try {
        const newUserResult = await pool.query(updateQuery2);
    } catch (error) {
        return res.status(500).json(new ApiError(
            500,
            `unable to update merchant event in database`,
            error
        ));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                202,
                { msg: `${dbname} updated successfully` },
                `merchant updated`
            )
        );
});

const getMerchants = asyncHandler(async (req, res) => {
    const dbname = "merchants";

    const query = {
        text: `SELECT * FROM ${dbname}`,
    };

    const result = await pool.query(query);
    const merchants = result.rows;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { merchants },
                `${dbname} fetched successfully`
            )
        );
});

const getPendingMerchants = asyncHandler(async (req, res) => {
    const dbname = "events";

    const query = {
        text: `SELECT * FROM ${dbname}
               WHERE event_kind = $1`,
        values: [11004],
    };

    const result = await pool.query(query);
    const merchants = result.rows.map(row => {
        let merchant = JSON.parse(row.event_content);
        merchant["dbid"] = row.id;
        return merchant;
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { merchants },
                `${dbname} fetched successfully`
            )
        );
});

const deleteRequest = asyncHandler(async (req, res) => {
    const { dbid } = req.body;
    const dbname = "events";

    const query = {
        text: `DELETE FROM ${dbname}
               WHERE id = $1`,
        values: [dbid],
    };

    try {
        const deletedUser = await pool.query(query);
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiResponse(
            500,
            `can't delete request from database`,
            error
        ));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { },
                `${dbname} deleted successfully`
            )
        );
});

export { addMerchant, deleteMerchant, updateMerchant, getMerchants, getPendingMerchants, deleteRequest, setupRelay, getRelay };
