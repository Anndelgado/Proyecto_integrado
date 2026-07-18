// ======================================================
// server.js
// Barranquilla Convive - Backend
// ======================================================
// API REST sobre PostgreSQL para reemplazar json-server. Expone
// /api/<recurso> para cada colección que antes vivía en
// database/db.json (users, alertas, citas, etc.), con el mismo
// contrato (filtros por query params, _sort/_order) que ya
// consumen los servicios del frontend.
// ======================================================

// IMPORTANTE: "./config.js" debe ser el PRIMER import de este archivo.
// Carga backend/.env (con override: true, para que siempre gane sobre
// variables PGUSER/PGPASSWORD/etc. que puedan existir ya en el sistema
// operativo). Al ser el primer import, se garantiza que se ejecute
// antes que "./db/pool.js", que sí necesita process.env.DATABASE_URL
// ya cargado en el momento en que arma la conexión.
import "./config.js";

import express from "express";
import cors from "cors";
import { pool } from "./db/pool.js";
import { initDatabase } from "./db/init.js";
import { resources } from "./resources.js";
import { genericRouter } from "./lib/genericRouter.js";

const PORT = process.env.PORT ?? 4000;

const app = express();

app.use(cors());
app.use(express.json());

// Salud del servicio / de la conexión a la base de datos
app.get("/api/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.json({ status: "ok", database: "connected" });

    } catch (error) {

        res.status(500).json({ status: "error", database: "disconnected" });

    }

});

for (const [key, config] of Object.entries(resources)) {

    app.use(`/api/${key}`, genericRouter(key, config));

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
