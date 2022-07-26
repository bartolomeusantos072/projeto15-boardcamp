import database from "../config/database.js";

export async function listGames(req, res) {


    const {name} = req.query;
    try {
        const params = [];
        let clauseWhere = '';

        if (name) {
            params.push(`${name}%`);
            clauseWhere += `WHERE games.name ILIKE $${
                params.length
            }`; 
        }

        const result = await database.query(`
        SELECT games.*, categories.name AS "categoryName" 
        FROM games
        JOIN categories ON categories.id=games."categoryId"
        ${clauseWhere}
      `, params);
        res.send(result.rows);

    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function createGame(req, res) {
    const {name,image,stockTotal,categoryId,pricePerDay} = req.body;
    try {
        const result = await database.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
        if (result.rowCount === 0) {
          return res.sendStatus(400); 
        }
    
        await database.query(`
          INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
          VALUES ($1, $2, $3, $4, $5);
        `, [name, image, Number(stockTotal), categoryId, Number(pricePerDay)]);
    
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}
