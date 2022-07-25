import rentalsSchema from "../schemas/rentalSchema.js";

export function validateRental(req,res,next){
    const validation =rentalsSchema.validate(req.body);
    if(validation.error){
        res.sendStatus(400);
    }
    next();
}