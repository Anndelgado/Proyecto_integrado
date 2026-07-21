import { apiFetch } from "../http.js";
const URL = "/api/citas";
export async function getCitas(psicologoId) {

    const response = await apiFetch(`${URL}?psicologoId=${psicologoId}&_sort=fecha,hora&_order=asc,asc`);

    if (!response.ok) {

        throw new Error("Error obteniendo las citas.");

    }

    return await response.json();

}
export async function createCita(cita) {

    const response = await apiFetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(cita)

    });

    if (!response.ok) {

        throw new Error("No se pudo programar la cita.");

    }

    return await response.json();

}
export async function deleteCita(id) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar la cita.");

    }

    return true;

}
