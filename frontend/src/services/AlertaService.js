import { apiFetch } from "../http.js";
const URL = "/api/alertas";
export async function getAlertas() {

    const response = await apiFetch(`${URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo alertas.");
    }
    return await response.json();
}

export async function getAlertaById(id) {

    const response = await apiFetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Alerta no encontrada.");

    }

    return await response.json();

}
export async function createAlerta(alerta) {

    const response = await apiFetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(alerta)

    });

    if (!response.ok) {

        throw new Error("No se pudo registrar la alerta.");

    }

    return await response.json();

}
export async function updateAlertaEstado(id, estado) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ estado })

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar la alerta.");

    }

    return await response.json();

}
