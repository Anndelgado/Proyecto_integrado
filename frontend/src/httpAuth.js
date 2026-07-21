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
    if (isApiCall && !isPublicPath && response.status === 401) {

        clearSession();
        navigate("/login");

    }

    return response;

};
