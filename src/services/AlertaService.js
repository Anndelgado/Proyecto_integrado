// ======================================================
// AlertaService.js
// Barranquilla Convive
// ======================================================

const URL = "http://localhost:3000/alertas";

//======================================================
// Obtener todas las alertas (más recientes primero)
//======================================================

export async function getAlertas() {

    const response = await fetch(`${URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo alertas.");

    }

    return await response.json();

}

//======================================================
// Obtener una alerta
//======================================================

export async function getAlertaById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Alerta no encontrada.");

    }

    return await response.json();

}

//======================================================
// Crear una alerta
//======================================================

export async function createAlerta(alerta) {

    const response = await fetch(URL, {

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

//======================================================
// Actualizar estado de una alerta
//======================================================

export async function updateAlertaEstado(id, estado) {

    const response = await fetch(`${URL}/${id}`, {

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
