// ======================================================
// InstitucionService.js
// Barranquilla Convive
// ======================================================

const URL = "/api/instituciones";

//======================================================
// Obtener todas las instituciones
//======================================================

export async function getInstituciones() {

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo instituciones.");

    }

    return await response.json();

}

//======================================================
// Obtener una institución
//======================================================

export async function getInstitucionById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Institución no encontrada.");

    }

    return await response.json();

}

//======================================================
// Buscar una institución por su código (ej. "IED-4521")
// Se usa en el registro de estudiantes, donde el usuario escribe
// el código en vez de elegir la institución de una lista.
//======================================================

export async function getInstitucionByCodigo(codigo) {

    const response = await fetch(`${URL}?codigo=${encodeURIComponent(codigo)}`);

    if (!response.ok) {

        throw new Error("Error buscando la institución.");

    }

    const instituciones = await response.json();

    return instituciones[0] || null;

}

//======================================================
// Crear institución
//======================================================

export async function createInstitucion(institucion) {

    const response = await fetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(institucion)

    });

    if (!response.ok) {

        throw new Error("No se pudo crear la institución.");

    }

    return await response.json();

}

//======================================================
// Actualizar institución
//======================================================

export async function updateInstitucion(id, institucion) {

    const response = await fetch(`${URL}/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(institucion)

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar la institución.");

    }

    return await response.json();

}

//======================================================
// Eliminar institución
//======================================================

export async function deleteInstitucion(id) {

    const response = await fetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar la institución.");

    }

    return true;

}
