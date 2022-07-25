import {Router} from "express";
import {rentalPost, listRentals, rentalFinish, deleteRental} from "../controllers/rentalsController.js";
import {validateRental} from "../middlewares/rentalMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals",listRentals);
rentalsRouter.post("/rentals",validateRental,rentalPost);
rentalsRouter.post("/rentals/:id/return",rentalFinish);
rentalsRouter.delete("/rentals/:id",deleteRental);

export default rentalsRouter

