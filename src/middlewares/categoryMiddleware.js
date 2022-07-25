import categoriesSchema from "../schemas/categoriesSchema.js"

export function validateBodyCategory(req,res,next){
   
    const validation = categoriesSchema.validate(req.body)
    if(validation.error){
        res.status(400).send("AVISO: Este campo não pode estar vazio. Por favor insira um nome válido");
    }
    next();
}