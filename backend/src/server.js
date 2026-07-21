import "./config.js";

import express from "express";
import cors from "cors";
import { pool } from "./db/pool.js";
import { initDatabase } from "./db/init.js";
import { resources } from "./resources.js";
import { genericRouter } from "./lib/genericRouter.js";
import { requireAuth } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { publicUsersRouter } from "./routes/publicUsers.js";

const PUBLIC_RESOURCES = new Set(["roles", "instituciones"]);

const PORT = process.env.PORT ?? 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({ status: "ok", database: "connected" });

    } catch (error) {

        res.status(500).json({ status: "error", database: "disconnected" });

    }

});

app.use("/api/auth", authRouter);

app.use("/api/users", publicUsersRouter);

for (const [key, config] of Object.entries(resources)) {

    if (PUBLIC_RESOURCES.has(key)) {

        app.use(`/api/${key}`, genericRouter(key, config));

        continue;

    }

    if (key === "users") {

        app.use(`/api/${key}`, (req, res, next) => {

            if (req.method === "POST") return next();

            return requireAuth(req, res, next);

        }, genericRouter(key, config));

        continue;

    }

    app.use(`/api/${key}`, requireAuth, genericRouter(key, config));

}

app.use((req, res) => {

    res.status(404).json({ error: "Recurso no encontrado." });

});

async function start() {

    try {

        await initDatabase();

        app.listen(PORT, () => {

            console.log(`[api] Barranquilla Convive backend escuchando en http://localhost:${PORT}`);

        });

    } catch (error) {

        console.error("[api] No se pudo iniciar el servidor. ¿Está Postgres corriendo?");

        console.error(error);

        process.exit(1);

    }

}

start();
