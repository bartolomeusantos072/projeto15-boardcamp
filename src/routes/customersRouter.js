import {Router} from "express";
import { listCustomers, getCustomer, createCustomer, updateCustomer } from "../controllers/costumersController.js";
import {validateCustomer} from "../middlewares/customersMiddleware.js"

const customersRouter = Router();

customersRouter.get("/customers",listCustomers);
customersRouter.get("/customers/:id",getCustomer);
customersRouter.post("/customers",validateCustomer, createCustomer);
customersRouter.put("/customers/:id",validateCustomer, updateCustomer);

export default customersRouter;