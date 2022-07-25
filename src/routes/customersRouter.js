import {Router} from "express";
import { listcustomers,getCustomer,createCustomer, updateCustomer } from "../controllers/customersController.js";
import {validateCustomer} from "../middlewares/customersMiddleware.js"

const customersRouter = Router();

customersRouter.get("/customers",listcustomers);
customersRouter.get("/customers/:id",getCustomer);
customersRouter.post("/customers",validateCustomer, createCustomer);
customersRouter.put("/customers",validateCustomer, updateCustomer);

export default customersRouter;