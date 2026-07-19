// ======================================================
// auth.js
// Barranquilla Convive - Backend
// ======================================================
// Middleware que exige un token de sesión válido en el header
// "Authorization: Bearer <token>". Si es válido, agrega el usuario
// autenticado a req.user (id, rol, institucionId). Si no, corta la
// petición con 401 antes de que llegue al router genérico.
// ======================================================

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
