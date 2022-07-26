import {Router} from "express";

import categoriesRouter from "./categoriesRouter.js";
import customersRouter from "./customersRouter.js";
import gamesRouter from "./gamesRouter.js";
import rentalsRouter from "./rentalsRouter.js";

const routers= Router();
routers.use(categoriesRouter); 
routers.use(gamesRouter); 
routers.use(customersRouter); 
routers.use(rentalsRouter); 

export default routers;