import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {

    throw new Error(
        "Falta SESSION_SECRET en el .env del backend. " +
        "Genera uno con: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );

}

const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; 

function sign(data) {

    return createHmac("sha256", SECRET).update(data).digest("base64url");

}

export function createToken(payload, ttlMs = DEFAULT_TTL_MS) {

    const body = { ...payload, exp: Date.now() + ttlMs };
    const encodedBody = Buffer.from(JSON.stringify(body)).toString("base64url");
    const signature = sign(encodedBody);

    return `${encodedBody}.${signature}`;

}

export function verifyToken(token) {

    if (typeof token !== "string" || !token.includes(".")) {

        return null;

    }

    const [encodedBody, signature] = token.split(".");

    const expectedSignature = sign(encodedBody);

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {

        return null;

    }

    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {

        return null; 

    }

    const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf-8"));

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {

        return null; 

    }

    return payload;

}
