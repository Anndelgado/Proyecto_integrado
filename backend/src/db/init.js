// ======================================================
// init.js
// Barranquilla Convive - Backend
// ======================================================
// Al arrancar el servidor:
//   1. Crea las tablas si no existen (schema.sql, es idempotente).
//   2. Si la tabla "users" está vacía, siembra los datos de ejemplo
//      que antes vivían en database/db.json (json-server), para que
//      el proyecto se pueda probar de inmediato con los mismos
//      usuarios/casos de prueba.
// Se ejecuta automáticamente cada vez que se hace `npm run dev` o
// `npm start` en el backend, así que no hace falta correr ninguna
// migración a mano.
// ======================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./pool.js";
import { seedData } from "./seedData.js";
import { resources } from "../resources.js";
import { hashPassword } from "../lib/passwords.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Orden de inserción: respeta las llaves foráneas (instituciones antes
// que cursos, cursos antes que users que las referencian, etc.)
const SEED_ORDER = [
    "roles",
    "instituciones",
    "cursos",
    "users",
    "alertas",
    "seguimientos",
    "notificaciones",
    "tamizajeHabilitaciones",
    "tamizajeResultados",
    "citas",
    "testResultados",
    "testAsignaciones"
];

export async function initDatabase() {

    const schemaSql = readFileSync(join(__dirname, "schema.sql"), "utf-8");

    await pool.query(schemaSql);

    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM users');

    if (rows[0].count > 0) {

        console.log("[db] Ya hay datos en la base, se omite la siembra inicial.");

        return;

    }

    console.log("[db] Base de datos vacía, sembrando datos de ejemplo...");

    for (const key of SEED_ORDER) {

        const config = resources[key];

        const rowsToInsert = seedData[key] ?? [];

        for (const row of rowsToInsert) {

            await insertRow(key, config, row);

        }

        // Sincroniza la secuencia de "id" con el máximo id insertado,
        // para que los próximos INSERT (sin id explícito) no choquen.
        await pool.query(
            `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM "${config.table}"), 1))`,
            [`"${config.table}"`]
        );

        console.log(`[db]  - ${key}: ${rowsToInsert.length} registro(s)`);

    }

    console.log("[db] Siembra inicial completada.");

}

async function insertRow(resourceKey, config, row) {

    const entries = Object.entries(row).filter(([key]) => config.columns.includes(key));

    const cols = entries.map(([key]) => `"${key}"`);

    const placeholders = entries.map((_, i) => `$${i + 1}`);

    // seedData.js trae contraseñas en texto plano para que sean fáciles
    // de leer/probar (ej. "admin123"); se hashean aquí mismo, justo
    // antes de guardarlas, para que nunca queden en texto plano en la
    // base de datos real.
    const values = entries.map(([key, value]) =>
        resourceKey === "users" && key === "password" && value
            ? hashPassword(value)
            : value ?? null
    );

    const sql = `INSERT INTO "${config.table}" (${cols.join(", ")}) VALUES (${placeholders.join(", ")})`;

    await pool.query(sql, values);

}
