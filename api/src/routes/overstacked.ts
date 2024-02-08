
import express from "express";

const router: express.Router = new express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {

    // Create all your database functions in the "utils" directory
    // You want to have all the database functions separate based on category
    // Like if you want to create settings, you want it in Settings.ts

    res.json({ alive: true });

})
