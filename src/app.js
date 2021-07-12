import express from "express";
import cors from "cors";
import { stripHtml } from "string-strip-html";

import connection from "./database/database.js";
import { itemSchema } from "./schemas/itemSchema.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/items", async (req,res)=>{
    try{
        const {text} = req.body;
        
        if(!text) {
            return res.sendStatus(400);
        }
        req.body.text = stripHtml(text).result.trim();
        const err = itemSchema.validate(req.body).error;
        if(err) {
            return res.sendStatus(400);
        }

        const result = await connection.query(`
            INSERT INTO items (text) VALUES ($1)
            RETURNING id
        `,[text]);

        if (result.rows[0]?.id > 0){
            res.sendStatus(201);
        }

    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

app.get("/items", async (req,res)=>{
    try{
        const result = await connection.query(`
            SELECT * FROM items;
        `);
        res.send(result.rows);

    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})
export default app;
