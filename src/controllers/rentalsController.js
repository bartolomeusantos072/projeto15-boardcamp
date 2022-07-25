import database from "../config/database.js";

export async function rentalPost(){
    const  {costumerId, gameId}=req.query;

    try{
        

    }catch(e){
        console.error(e);
        res.senStatus(500);
    }
}

export async function listRentals(){

    try{

    }catch(e){
        console.error(e);
        res.senStatus(500);
    }
}

export async function rentalFinish(){

    try{

    }catch(e){
        console.error(e);
        res.senStatus(500);
    }
}

export async function deleteRental(){

    try{

    }catch(e){
        console.error(e);
        res.senStatus(500);
    }
}
