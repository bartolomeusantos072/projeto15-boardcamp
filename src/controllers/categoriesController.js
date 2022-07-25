import database from "../config/database.js";

export async function listCategories(req,res){
    const {limit, offset, orderBy, desc}=req.query;
    const offsetRule = offset ? `OFFSET ${offset}`:'';
    const limitRule=limit? `LIMIT ${limit}`:'';
    const orderRule = orderBy ? `ORDER BY ${filters[orderBy]} ${desc ?'DESC':''}`:'';
    
    const filters={
        id:1,name:2
    }
    
    try{
        const result = await database.query(
            `SELECT * FROM categories 
            ${offsetRule}
            ${limitRule}
            ${orderRule}`
        );

        res.send(result.rows);

    }catch(e){
        console.error(e);
        res.sendStatus(500);
    }

}
export async function createCategory(req, res){
    const {name} = req.body;
    try{
        const result = await database.query('SELECT id FROM categories WHERE name=$1',[name])
        
        if(result.rowCount>0){
            res.sendStatus(409);
        }

        await database.query('INSERT INTO categories(name) VALUES ($1)',[name]);
        res.sendStatus(201);

    }catch(e){
        console.error(e);
        res.sendStatus(500);
    }
}