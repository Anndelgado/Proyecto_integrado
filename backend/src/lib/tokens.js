// ======================================================
// tokens.js
// Barranquilla Convive - Backend
// ======================================================
// Tokens de sesión firmados con HMAC-SHA256 (formato similar a un
// JWT simplificado, hecho a mano con "node:crypto" para no agregar
// dependencias nuevas). Formato: "<payload-base64url>.<firma-base64url>"
// ======================================================

import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {

    throw new Error(
        "Falta SESSION_SECRET en el .env del backend. " +
        "Genera uno con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );

}

const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

function sign(data) {

    return createHmac("sha256", SECRET).update(data).digest("base64url");

}

// Crea un token para un usuario ya autenticado.
export function createToken(payload, ttlMs = DEFAULT_TTL_MS) {

    const body = { ...payload, exp: Date.now() + ttlMs };
    const encodedBody = Buffer.from(JSON.stringify(body)).toString("base64url");
    const signature = sign(encodedBody);

    return `${encodedBody}.${signature}`;

}

// Verifica firma + expiración. Devuelve el payload si es válido, o null.
export function verifyToken(token) {

    if (typeof token !== "string" || !token.includes(".")) {

        return null;

    }

    const [encodedBody, signature] = token.split(".");

    const expectedSignature = sign(encodedBody);

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    // Longitudes distintas -> timingSafeEqual lanzaría error, así que se
    // descarta antes en vez de comparar.
    if (signatureBuffer.length !== expectedBuffer.length) {

        return null;

    }

    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {

        return null; // firma no coincide -> token falsificado o alterado

    }

    const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf-8"));

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {

        return null; // token expirado

    }

    return payload;

}
