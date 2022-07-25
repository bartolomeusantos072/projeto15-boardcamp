import {Router} from "express";
import { createCategory, listCategories } from "../controllers/categoriesController.js";
import {validateBodyCategory} from "../middlewares/categoryMiddleware.js"

const categoriesRouter = Router();

categoriesRouter.get("/categories",listCategories);
categoriesRouter.post("/categories",validateBodyCategory,createCategory)

export default categoriesRouter;