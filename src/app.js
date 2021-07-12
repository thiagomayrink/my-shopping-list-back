import express from "express";
import cors from "cors";
import { stripHtml } from "string-strip-html";

import connection from "./database/database.js";
import { itemSchema } from "./schemas/itemSchema.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/items",(req,res)=>{
    try{
        
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

export default app;
