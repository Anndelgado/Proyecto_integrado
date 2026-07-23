import pg from "pg";

const { Pool } = pg;

const connectionString =
    process.env.DATABASE_URL ??
    `postgres://${process.env.PGUSER ?? "postgres"}:${process.env.PGPASSWORD ?? "postgres"}@${process.env.PGHOST ?? "localhost"}:${process.env.PGPORT ?? "5432"}/${process.env.PGDATABASE ?? "barranquilla_convive"}`;

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
});

pool.on("error", (error) => {

    console.error("Error inesperado en el pool de Postgres:", error);

});