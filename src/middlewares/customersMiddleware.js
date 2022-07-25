import customerSchema from "../schemas/customersSchema.js"

export function validateCustomer(req,res,next){
   
    const validation = customerSchema.validate(req.body)
    if(validation.error){
        res.status(400).send("AVISO: Este campo não pode estar vazio. Por favor insira um cpf válido");
    }
    next();
}