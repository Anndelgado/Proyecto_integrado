// ======================================================
// passwords.js
// Barranquilla Convive - Backend
// ======================================================
// Hashing de contraseñas con scrypt (módulo nativo "node:crypto",
// no requiere instalar bcrypt). Cada contraseña se guarda como
// "scrypt:<salt>:<hash>" en vez de texto plano.
// ======================================================

import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

// Crea un hash nuevo (con salt aleatorio) para guardar en la base de datos.
export function hashPassword(plainPassword) {

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");

    return `scrypt:${salt}:${hash}`;

}

// Compara una contraseña en texto plano contra el valor guardado.
// Usa timingSafeEqual para no filtrar información por tiempo de respuesta.
export function verifyPassword(plainPassword, storedValue) {

    if (typeof storedValue !== "string" || !storedValue.startsWith("scrypt:")) {

        return false; // valor corrupto, vacío, o todavía en texto plano

    }

    const [, salt, hashHex] = storedValue.split(":");

    const storedHash = Buffer.from(hashHex, "hex");
    const candidateHash = scryptSync(plainPassword, salt, KEY_LENGTH);

    if (storedHash.length !== candidateHash.length) {

        return false;

    }

    return timingSafeEqual(storedHash, candidateHash);

}

// Útil para no volver a hashear algo que ya está hasheado (p. ej. en seeds).
export function isHashed(value) {

    return typeof value === "string" && value.startsWith("scrypt:");

}
