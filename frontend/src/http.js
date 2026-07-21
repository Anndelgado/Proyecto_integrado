import { getToken } from "./session.js";

export async function apiFetch(url, options = {}) {

    const token = getToken();

    const headers = {

        ...(options.headers || {}),

        ...(token ? { Authorization: `Bearer ${token}` } : {})

    };

    return fetch(url, { ...options, headers });

}
