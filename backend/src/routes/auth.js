// ======================================================
// routes/auth.js
// Barranquilla Convive - Backend
// ======================================================
// Único lugar donde se compara una contraseña. Antes esto lo hacía
// el navegador (trayéndose la contraseña real por la red y
// comparando en JS). Ahora el cliente solo recibe un token si la
// contraseña es correcta; la contraseña real nunca sale del backend.
// ======================================================

import { Router } from "express";
import { pool } from "../db/pool.js";
import { verifyPassword } from "../lib/passwords.js";
import { createToken } from "../lib/tokens.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {

    try {

        const { documento, password } = req.body ?? {};

        if (!documento || !password) {

            return res.status(400).json({ error: "Cédula y contraseña son obligatorias." });

        }

        const result = await pool.query(
            `SELECT * FROM "users" WHERE documento = $1`,
            [documento]
        );

        const user = result.rows[0];

        // Mismo mensaje de error tanto si el usuario no existe como si la
        // contraseña es incorrecta, para no revelar qué cédulas existen.
        if (!user || !verifyPassword(password, user.password)) {

            return res.status(401).json({ error: "Cédula o contraseña incorrectos." });

        }

        if (user.estado !== "activo") {

            return res.status(403).json({
                error: "Tu cuenta todavía no ha sido aprobada por tu institución. Intenta más tarde."
            });

        }

        const { password: _omit, ...safeUser } = user;

        const token = createToken({
            id: user.id,
            rol: user.rol,
            institucionId: user.institucionId
        });

        res.json({ token, user: safeUser });

    } catch (error) {

        console.error("[auth] POST /login ->", error);
        res.status(500).json({ error: "Error iniciando sesión." });

    }

});
