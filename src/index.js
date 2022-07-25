import express from "express";
import cors from "cors";
import dotenv from  "dotenv";

import routers from "./routes/index.js";

dotenv config();

const app=express();
app.use(express.json());
app.use(cors());
app.use(router)

const port= process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`Server is up and running on: ${port}`);
});