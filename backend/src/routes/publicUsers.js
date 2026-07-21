import { Router } from "express";
import { pool } from "../db/pool.js";

export const publicUsersRouter = Router();

publicUsersRouter.get("/check", async (req, res) => {

    try {

        const { correo, documento } = req.query;

        if (!correo && !documento) {

            return res.status(400).json({ error: "Falta el parámetro 'correo' o 'documento'." });

        }

        const column = correo ? "correo" : "documento";
        const value = correo ?? documento;

        const result = await pool.query(
            `SELECT 1 FROM "users" WHERE ${column} = $1 LIMIT 1`,
            [value]
        );

        res.json({ exists: result.rows.length > 0 });

    } catch (error) {

        console.error("[publicUsers] GET /check ->", error);
        res.status(500).json({ error: "Error verificando el correo." });

    }

});
