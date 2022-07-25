import express from "express";
import cors from "cors";
import "dotenv/config";
import routers from "./routes/index.js";



const app=express();
app.use(express.json());
app.use(cors());
app.use(routers)

const port= process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`Server is up and running on: ${port}`);
});