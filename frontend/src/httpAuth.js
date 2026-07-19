// ======================================================
// httpAuth.js
// Barranquilla Convive
// ======================================================
// Los servicios (services/*.js) llaman "fetch" directamente, cada
// uno por su cuenta, sin pasar por un cliente HTTP común. Para que
// el backend pueda exigir sesión sin reescribir cada servicio, este
// módulo reemplaza "window.fetch" una sola vez al arrancar la app:
// cualquier petición a "/api/..." (menos el login) sale con el
// header "Authorization: Bearer <token>" si hay una sesión activa.
//
// Se importa una sola vez, como efecto secundario, desde main.js —
// mismo patrón que "config.js" en el backend.
// ======================================================

import { getToken, clearSession } from "./session.js";
import { navigate } from "./router.js";

const originalFetch = window.fetch.bind(window);

const PUBLIC_PATHS = ["/api/auth/login", "/api/health"];

window.fetch = async function (input, init = {}) {

    const url = typeof input === "string" ? input : input.url;

    const isApiCall = url.startsWith("/api/");
    const isPublicPath = PUBLIC_PATHS.some(path => url.startsWith(path));

    const token = getToken();

    if (isApiCall && !isPublicPath && token) {

        init = {

            ...init,

            headers: {

                ...(init.headers ?? {}),

                Authorization: `Bearer ${token}`

            }

        };

    }

    const response = await originalFetch(input, init);

    // Token vencido o inválido: se limpia la sesión y se manda al
    // login, en vez de dejar que cada vista falle de forma distinta.
    if (isApiCall && !isPublicPath && response.status === 401) {

        clearSession();
        navigate("/login");

    }

    return response;

};
