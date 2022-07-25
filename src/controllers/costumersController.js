import database from "../config/database.js";

export async function listCostumers(req, res) {

    const {cpf} = req.query;
    const params = [];
    const clauseWhere = "";

    if (cpf) {
        params.push(`${cpf}%`);
        clauseWhere += `WHERE cpf ILIKE $${
            params.length
        }`;
    }

    try {
        const result = await database.query(`SELECT * FROM costumers 
            ${clauseWhere}`, params);

        res.send(result.rows);

    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }

}

export async function getCostumer(req, res) {
    const {id} = req.params;

    if (isNaN(parseInt(id))) {
        res.sendStatus(400);
    }

    try {
        const sql = `
            SELECT * 
            FROM customers
            WHERE id = $1;
        `;
        const result = await client.query(sql, [id]);
        if (result.rowCount !== 1) {
            res.sendStatus(404);
        }
        res.status(200).send(result.rows);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }

}


export async function createCustomer(req, res) {
    const {name, phone, cpf, birthday} = req.body;

    try {
        const result = await db.query('SELECT id FROM customers WHERE cpf = $1', [cpf]);
        if (result.rowCount > 0) {
            res.sendStatus(409);
        }

        await db.query(`
          INSERT INTO customers (name, phone, cpf, birthday) 
          VALUES ($1, $2, $3, $4);
        `, [name, phone, cpf, birthday]);

        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}


export async function updateCustomer(req, res) {

    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    if (isNaN(parseInt(id))) {
        res.sendStatus(400);
    }

    try {
        const result = await db.query(`SELECT id FROM customers WHERE cpf = $1 AND id != $2`, [cpf, id]);
        if (result.rowCount > 0) {
            res.sendStatus(409);
        }
        await db.query(`
        UPDATE customers 
        SET 
          name = $1, 
          phone = $2, 
          cpf = $3, 
          birthday = $4 
        WHERE id = $5
      `, [
            name,
            phone,
            cpf,
            birthday,
            id
        ]);
        res.sendStatus(200);
    } catch (e) {
        console.log(error);
        res.sendStatus(500);
    }


}
