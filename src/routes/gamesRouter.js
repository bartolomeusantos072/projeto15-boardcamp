import { Router } from "express";
import { createGame, listGames } from "../controllers/gameController.js";
import { validateGame } from "../middlewares/gameValidator.js";

const gamesRouter = Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", validateGame, createGame);

export default gamesRouter;