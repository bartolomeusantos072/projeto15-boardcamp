import gamesSchema from "../schemas/gamesSchema.js"

export function validateGame(req,res,next){
   
    const validation = gamesSchema.validate(req.body)
    if(validation.error){
        res.status(400).send("AVISO: Este campo não pode estar vazio.");
    }
    next();
}