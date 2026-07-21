import { apiFetch } from "../http.js";

const URL = "/api/seguimientos";
export async function getSeguimientos() {

    const response = await apiFetch(`${URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo seguimientos.");

    }

    return await response.json();

}

export async function getSeguimientosByAlerta(alertaId) {

    const response = await apiFetch(`${URL}?alertaId=${alertaId}&_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo seguimientos.");

    }

    return await response.json();

}

export async function createSeguimiento(seguimiento) {

    const response = await apiFetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(seguimiento)

    });

    if (!response.ok) {

        throw new Error("No se pudo registrar el seguimiento.");

    }

    return await response.json();

}
