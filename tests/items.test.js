import supertest from 'supertest';

import app from '../src/app.js';
import connection from '../src/database/database.js';

beforeEach(async () =>{
    await connection.query('DELETE FROM items');
})

afterAll(async () => {
    await connection.query('DELETE FROM items');
    connection.end();
})

describe("POST /items", () => {
    
    it("returns 400 for empty html string", async () => {
        const item = {text: " <h1> <p> </p> </h1>  "};
        
        const result = await supertest(app).post("/items").send(item);
        expect(result.status).toEqual(400);
    })

    it("returns 400 for empty string", async () => {
        const item = {text: ""};
        
        const result = await supertest(app).post("/items").send(item);
        expect(result.status).toEqual(400);
    })

    it("returns 400 for invalid req.body", async () => {
        const item = {invalidBody: "invalid_property_name"};
        
        const result = await supertest(app).post("/items").send(item);
        expect(result.status).toEqual(400);
    })

    it("returns 201 for valid item", async () => {
        const item = {text: "valid_item"};
        
        const result = await supertest(app).post("/items").send(item);
        expect(result.status).toEqual(201);
    })
})

describe("GET /items", () => {
    
    it("returns items list for a non empty list", async () => {
        await connection.query(`
            INSERT INTO items (text) VALUES ("test_item")
        `);

        const result = await supertest(app).get("/items");
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    text: expect.any(String)
                })
            ])
        );
    })

    it("returns empty array for a empty list", async () => {
        
        const result = await supertest(app).get("/items");
        expect(result.status).toEqual(200);
        expect(result.body).toEqual(
            expect.arrayContaining([])
        );
    })
})