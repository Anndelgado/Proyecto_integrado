// ======================================================
// genericRouter.js
// Barranquilla Convive - Backend
// ======================================================
// Router REST genérico que imita el comportamiento de json-server
// (filtros por igualdad vía query params, _sort/_order, CRUD básico)
// pero contra PostgreSQL real, con los datos persistidos en disco.
//
// Se usa una lista blanca de columnas por recurso (ver resources.js)
// para armar el SQL de forma segura (nunca se interpola texto del
// usuario directamente en nombres de columna).
// ======================================================

import { Router } from "express";
import { pool } from "../db/pool.js";
import { hashPassword } from "./passwords.js";

const RESERVED_PARAMS = new Set(["_sort", "_order"]);

function quote(col) {
    return `"${col}"`;
}

// El recurso "users" nunca debe devolver la contraseña en una
// respuesta JSON, ni siquiera hasheada (no aporta nada al cliente
// y es una filtración innecesaria).
function sanitizeRow(resourceKey, row) {

    if (resourceKey !== "users" || !row) return row;

    const { password, ...safeRow } = row;

    return safeRow;

}

function sanitizeRows(resourceKey, rows) {

    return rows.map(row => sanitizeRow(resourceKey, row));

}

export function genericRouter(resourceKey, config) {

    const router = Router();
    const { table, columns, jsonColumns = [] } = config;
    const columnSet = new Set(columns);

    //==================================================
    // GET /  -> lista, con filtros por igualdad + _sort/_order
    //==================================================

    router.get("/", async (req, res) => {

        try {

            const filters = [];
            const values = [];

            for (const [key, value] of Object.entries(req.query)) {

                if (RESERVED_PARAMS.has(key)) continue;

                if (!columnSet.has(key)) continue; // se ignoran params desconocidos, igual que json-server

                values.push(value === "null" ? null : value);

                filters.push(`${quote(key)} = $${values.length}`);

            }

            let sql = `SELECT * FROM ${quote(table)}`;

            if (filters.length) {

                sql += ` WHERE ${filters.join(" AND ")}`;

            }

            const sortFields = (req.query._sort ?? "").split(",").map(s => s.trim()).filter(Boolean);
            const sortOrders = (req.query._order ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

            const orderClauses = sortFields
                .filter(field => columnSet.has(field))
                .map((field, index) => {

                    const order = sortOrders[index] === "desc" ? "DESC" : "ASC";

                    return `${quote(field)} ${order}`;

                });

            if (orderClauses.length) {

                sql += ` ORDER BY ${orderClauses.join(", ")}`;

            } else {

                sql += ` ORDER BY id ASC`;

            }

            const result = await pool.query(sql, values);

            res.json(sanitizeRows(resourceKey, result.rows));

        } catch (error) {

            console.error(`[${resourceKey}] GET / ->`, error);

            res.status(500).json({ error: `Error obteniendo ${resourceKey}.` });

        }

    });

    //==================================================
    // GET /:id
    //==================================================

    router.get("/:id", async (req, res) => {

        try {

            const sql = `SELECT * FROM ${quote(table)} WHERE id = $1`;

            const result = await pool.query(sql, [req.params.id]);

            if (!result.rows.length) {

                return res.status(404).json({ error: `${resourceKey} no encontrado.` });

            }

            res.json(sanitizeRow(resourceKey, result.rows[0]));

        } catch (error) {

            console.error(`[${resourceKey}] GET /:id ->`, error);

            res.status(500).json({ error: `Error obteniendo ${resourceKey}.` });

        }

    });

    //==================================================
    // POST /  -> crear
    //==================================================

    router.post("/", async (req, res) => {

        try {

            const entries = Object.entries(req.body ?? {})
                .filter(([key]) => columnSet.has(key) && key !== "id")
                .filter(([key, value]) => !(resourceKey === "users" && key === "password" && !value));

            if (!entries.length) {

                return res.status(400).json({ error: "Cuerpo de la petición vacío o inválido." });

            }

            const cols = entries.map(([key]) => quote(key));

            const placeholders = entries.map((_, index) => `$${index + 1}`);

            const values = entries.map(([key, value]) =>
                resourceKey === "users" && key === "password"
                    ? hashPassword(value)
                    : normalizeValue(value, jsonColumns.includes(key))
            );

            const sql = `
                INSERT INTO ${quote(table)} (${cols.join(", ")})
                VALUES (${placeholders.join(", ")})
                RETURNING *
            `;

            const result = await pool.query(sql, values);

            res.status(201).json(sanitizeRow(resourceKey, result.rows[0]));

        } catch (error) {

            console.error(`[${resourceKey}] POST / ->`, error);

            res.status(500).json({ error: `No se pudo crear el registro en ${resourceKey}.` });

        }

    });

    //==================================================
    // PUT/PATCH /:id  -> actualizar (parcial o total, mismo comportamiento)
    //==================================================

    async function update(req, res) {

        try {

            const entries = Object.entries(req.body ?? {})
                .filter(([key]) => columnSet.has(key) && key !== "id")
                .filter(([key, value]) => !(resourceKey === "users" && key === "password" && !value));

            if (!entries.length) {

                return res.status(400).json({ error: "Cuerpo de la petición vacío o inválido." });

            }

            const setClauses = entries.map(([key], index) => `${quote(key)} = $${index + 1}`);

            const values = entries.map(([key, value]) =>
                resourceKey === "users" && key === "password"
                    ? hashPassword(value)
                    : normalizeValue(value, jsonColumns.includes(key))
            );

            values.push(req.params.id);

            const sql = `
                UPDATE ${quote(table)}
                SET ${setClauses.join(", ")}
                WHERE id = $${values.length}
                RETURNING *
            `;

            const result = await pool.query(sql, values);

            if (!result.rows.length) {

                return res.status(404).json({ error: `${resourceKey} no encontrado.` });

            }

            res.json(sanitizeRow(resourceKey, result.rows[0]));

        } catch (error) {

            console.error(`[${resourceKey}] PUT/PATCH /:id ->`, error);

            res.status(500).json({ error: `No se pudo actualizar el registro en ${resourceKey}.` });

        }

    }

    router.put("/:id", update);

    router.patch("/:id", update);

    //==================================================
    // DELETE /:id
    //==================================================

    router.delete("/:id", async (req, res) => {

        try {

            const sql = `DELETE FROM ${quote(table)} WHERE id = $1 RETURNING id`;

            const result = await pool.query(sql, [req.params.id]);

            if (!result.rows.length) {

                return res.status(404).json({ error: `${resourceKey} no encontrado.` });

            }

            res.json({});

        } catch (error) {

            console.error(`[${resourceKey}] DELETE /:id ->`, error);

            res.status(500).json({ error: `No se pudo eliminar el registro en ${resourceKey}.` });

        }

    });

    return router;

}

function normalizeValue(value, isJsonColumn) {

    if (isJsonColumn) {

        // node-postgres serializa objetos/arrays a JSON automáticamente
        // para columnas jsonb, pero si llega undefined lo dejamos en [].
        return value ?? [];

    }

    return value === undefined ? null : value;

}
