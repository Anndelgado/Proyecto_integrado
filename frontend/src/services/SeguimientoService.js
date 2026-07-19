// ======================================================
// SeguimientoService.js
// Barranquilla Convive
// ======================================================

const URL = "/api/seguimientos";

//======================================================
// Obtener todos los seguimientos (más recientes primero)
//======================================================

export async function getSeguimientos() {

    const response = await fetch(`${URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo seguimientos.");

    }

    return await response.json();

}

//======================================================
// Obtener seguimientos de una alerta
//======================================================

export async function getSeguimientosByAlerta(alertaId) {

    const response = await fetch(`${URL}?alertaId=${alertaId}&_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo seguimientos.");

    }

    return await response.json();

}

//======================================================
// Registrar un nuevo seguimiento
//======================================================

export async function createSeguimiento(seguimiento) {

    const response = await fetch(URL, {

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
