// ======================================================
// session.js
// Barranquilla Convive
// ======================================================

const SESSION_KEY = "bc_session";
const TOKEN_KEY = "bc_token";

/**
 * Guarda el token de sesión (se envía en cada petición a la API)
 */
export function setToken(token) {

    sessionStorage.setItem(TOKEN_KEY, token);

}

/**
 * Obtiene el token de sesión guardado, o null si no hay sesión
 */
export function getToken() {

    return sessionStorage.getItem(TOKEN_KEY);

}

/**
 * Guarda la sesión
 */
export function setSession(user) {

    sessionStorage.setItem(

        SESSION_KEY,

        JSON.stringify(user)

    );

}

/**
 * Obtiene la sesión
 */
export function getSession() {

    const data = sessionStorage.getItem(SESSION_KEY);

    if (!data) return null;

    return JSON.parse(data);

}

/**
 * Elimina la sesión
 */
export function clearSession() {

    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

}