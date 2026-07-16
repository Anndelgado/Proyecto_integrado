// ======================================================
// session.js
// Barranquilla Convive
// ======================================================

const SESSION_KEY = "bc_session";

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

}

/**
 * ¿Existe sesión?
 */
export function isAuthenticated() {

    return !!getSession();

}