import { apiFetch } from "../http.js";
const ASIGNACIONES_URL = "/api/testAsignaciones";
export async function getAsignaciones(docenteId) {
    const response = await apiFetch(
        `${ASIGNACIONES_URL}?docenteId=${encodeURIComponent(docenteId)}&_sort=fecha&_order=desc`
    );

    if (!response.ok) {

        throw new Error("Error obteniendo las asignaciones de test.");

    }

    return await response.json();

}

export async function crearAsignacion({ docenteId, test, estudiante }) {

    const payload = {

        docenteId,

        test,

        estudiante,

        fecha: new Date().toISOString().slice(0, 10)

    };

    const response = await apiFetch(ASIGNACIONES_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(payload)

    });

    if (!response.ok) {

        throw new Error("No se pudo guardar la asignación del test.");

    }

    return await response.json();

}
