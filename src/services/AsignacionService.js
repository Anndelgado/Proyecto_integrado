// ======================================================
// AsignacionService.js
// Barranquilla Convive
// ======================================================
//
// Gestiona los test que un docente asigna a un estudiante y su
// estado ("pendiente" | "completado").
//
// ======================================================

const URL = "http://localhost:3000/asignaciones";

//======================================================
// Obtener asignaciones (con filtros opcionales)
//
// Ej: getAsignaciones({ estudianteId: 2, estado: "pendiente" })
//======================================================

export async function getAsignaciones(filtros = {}) {

    const params = new URLSearchParams(filtros).toString();

    const response = await fetch(`${URL}${params ? `?${params}` : ""}`);

    if (!response.ok) {

        throw new Error("Error obteniendo las asignaciones.");

    }

    return await response.json();

}

//======================================================
// Obtener una asignación por id
//======================================================

export async function getAsignacionById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Asignación no encontrada.");

    }

    return await response.json();

}

//======================================================
// Crear una asignación (docente asigna un test)
//======================================================

export async function createAsignacion(asignacion) {

    const response = await fetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            estado: "pendiente",

            ...asignacion

        })

    });

    if (!response.ok) {

        throw new Error("No se pudo asignar el test.");

    }

    return await response.json();

}

//======================================================
// Actualizar el estado de una asignación
//======================================================

export async function updateAsignacionEstado(id, estado) {

    const response = await fetch(`${URL}/${id}`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ estado })

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar la asignación.");

    }

    return await response.json();

}
