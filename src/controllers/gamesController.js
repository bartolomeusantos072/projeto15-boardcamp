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

        const result = await db.query(`
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

export async function createGame(req, res) {}
