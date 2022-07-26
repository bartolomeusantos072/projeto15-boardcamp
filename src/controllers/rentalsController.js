import database from "../config/database.js";

export async function listRentals(req, res) {


    const {customerId, gameId} = req.query;

    try {
      const params = [];
      const conditions = [];
      let ruleWhere = '';
  
      if (customerId) {
        params.push(customerId);
        conditions.push(`rentals."customerId" = $${params.length}`);
      }
  
      if (gameId) {
        params.push(gameId);
        conditions.push(`rentals."gameId"=$${params.length}`);
      }
  
      if (params.length > 0) {
        ruleWhere += `WHERE ${conditions.join(" AND ")}`;
      }
  
      const rentals = await database.query({
        text: `
          SELECT 
            rentals.*,
            customers.name AS customer,
            games.name,
            categories.*
          FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            JOIN categories ON categories.id=games."categoryId"
          ${ruleWhere}
        `,
        rowMode: "array"
      }, params);
  
      
      res.status(200).send(rentals.rows);
    
    }catch(e){
      console.error(e);
      res.sendStatus(500);
  }
}

export async function createRental(req,res) {

    const {customerId, gameId, daysRented} = req.body;


    try {
        const resultCustomer = await database.query(`SELECT id FROM customers WHERE id = $1`, [customerId]);
      if (resultCustomer.rowCount === 0) {
        return res.sendStatus(400);
      }
  
      const resultGame = await database.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
      if (resultGame.rowCount === 0) {
        return res.sendStatus(400); 
      }
      const game = resultGame.rows[0];
  
      const result = await database.query(`
        SELECT id
        FROM rentals 
        WHERE "gameId" = $1 AND "returnDate" IS null
      `, [gameId]);
  
      if (result.rowCount > 0) {
        if (game.stockTotal === result.rowCount) {
          return res.sendStatus(400); // bad request
        }
      }
  
      const originalPrice = daysRented * game.pricePerDay;
      await database.query(`
        INSERT INTO 
          rentals (
            "customerId", "gameId", "rentDate", 
            "daysRented", "returnDate", "originalPrice", "delayFee"
          )
          VALUES ($1, $2, NOW(), $3, null, $4, null); 
        `, [customerId, gameId, daysRented, originalPrice]);
  
      res.sendStatus(201);   
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}

export async function rentalFinish(req,res) {

    try {
        const {id} = req.params;
        const rental = await database.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

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
        await database.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`, values);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}

export async function deleteRental(req,res) {
    const {id} = req.params;
    try {

        const rental = await database.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (rental.rowCount !== 1) {
            res.senStatus(404)
        }
        if (rental.rows[0].delayFee !== null) {
            res.senStatus(400);
        }

        await database.query(` DELETE FROM rental WHERE id = $1;`, [id]);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.senStatus(500);
    }
}
