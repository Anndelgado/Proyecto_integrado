// ======================================================
// InstitucionService.js
// Barranquilla Convive
// ======================================================

const URL = "http://localhost:3000/instituciones";

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
