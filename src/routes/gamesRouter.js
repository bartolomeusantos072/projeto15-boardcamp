import { Router } from "express";
import { createGame, listGames } from "../controllers/gamesController.js";
import { validateGame } from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", validateGame, createGame);

export default gamesRouter;