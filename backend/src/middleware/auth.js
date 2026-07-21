import { verifyToken } from "../lib/tokens.js";

export function requireAuth(req, res, next) {

    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    const payload = token ? verifyToken(token) : null;

    if (!payload) {

        return res.status(401).json({ error: "No autenticado. Inicia sesión de nuevo." });

    }

    req.user = payload;

    next();

}
