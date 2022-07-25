import database from "../config/database.js";

export async function rentalPost() {
    const {customerId, gameId} = req.query;

    try {

        let rentals;
        let sql = `
            SELECT 
            rentals.*,
            customers.id,
            customers.name,
            games.id,
            games.name,
            games."categoryId",
            categories."categoryName"
            FROM rentals
            INNER JOIN customers
            ON rentals."customerId" = customers.id
            INNER JOIN games
            ON rentals."gameId" = games.id
            INNER JOIN categories
            ON games."categoryId" = categories.id
        `;
        if (customerId) {
            sql += 'WHERE customers.id = $1;';
            rentals = await client.query(sql, [customerId]);
        } else if (gameId) {
            sql += 'WHERE games.id = $1;';
            rentals = await client.query(sql, [gameId]);
        } else {
            sql += ';';
            rentals = await client.query(sql);
        }

    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}

export async function listRentals() {

    const {customerId, gameId, daysRented} = req.body;


    try {
        const customersResult = await db.query(` SELECT id FROM customers WHERE id = $1`, [customerId]);
        if (customersResult.rowCount === 0) {
            res.sendStatus(400);
        }
        
        const gameResult = await db.query(` SELECT * FROM games WHERE id=$1`, [gameId]);
        if (gameResult.rowCount === 0) {
            res.sendStatus(400); 
        }

        const game = gameResult.rows[0];

        const result = await db.query(` SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`, [gameId]);

        if (result.rowCount > 0 && game.stockTotal === result.rowCount) {
                return res.sendStatus(400); 
        }
        
        const originalPrice = daysRented * game.pricePerDay;
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, null, $4, null);`, [customerId, gameId, daysRented, originalPrice]);
    

        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}

export async function rentalFinish() {

    try {
        const {id} = req.params;
        const rental = await client.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if (rental.rowCount > 0) {
            res.status(404).send("The rental don't exist");
        }

        if (rental.rows[0].delayFee !== null) {
            throw new CustomError(400, 'The rental is finalized');
        }

        const now = new Date();
        const delay = now.valueOf() - Date.parse(rental.rows[0].rentDate) / (24 * 60 * 60 * 1000);
        const values = [
            now.toISOString(),
            delay > 0 ? delay * rental.rows[0].originalPrice : 0,
            id
        ];
        await client.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, values);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}

export async function deleteRental() {
    const {id} = req.params;
    try {

        const rental = await client.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (rental.rowCount !== 1) {
            res.senStatus(404)
        }
        if (rental.rows[0].delayFee !== null) {
            res.senStatus(400);
        }

        await client.query(` DELETE FROM rental WHERE id = $1;`, [id]);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}
