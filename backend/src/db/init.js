import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./pool.js";
import { seedData } from "./seedData.js";
import { resources } from "../resources.js";
import { hashPassword } from "../lib/passwords.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

        await pool.query(
            `SELECT setval(
                pg_get_serial_sequence($1, 'id'),
                COALESCE((SELECT MAX(id) FROM "${config.table}"), 1),
                (SELECT MAX(id) FROM "${config.table}") IS NOT NULL
            )`,
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

    const values = entries.map(([key, value]) => {

        if (resourceKey === "users" && key === "password" && value) {

            return hashPassword(value);

        }
        
        if (config.jsonColumns?.includes(key)) {

            return JSON.stringify(value ?? []);

        }

        return value ?? null;

    });

    const sql = `INSERT INTO "${config.table}" (${cols.join(", ")}) VALUES (${placeholders.join(", ")})`;

    await pool.query(sql, values);

}
