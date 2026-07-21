import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;


export function hashPassword(plainPassword) {

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(plainPassword, salt, KEY_LENGTH).toString("hex");

    return `scrypt:${salt}:${hash}`;

}

export function verifyPassword(plainPassword, storedValue) {

    if (typeof storedValue !== "string" || !storedValue.startsWith("scrypt:")) {

        return false; 

    }

    const [, salt, hashHex] = storedValue.split(":");

    const storedHash = Buffer.from(hashHex, "hex");
    const candidateHash = scryptSync(plainPassword, salt, KEY_LENGTH);

    if (storedHash.length !== candidateHash.length) {

        return false;

    }

    return timingSafeEqual(storedHash, candidateHash);

}

export function isHashed(value) {

    return typeof value === "string" && value.startsWith("scrypt:");

}
