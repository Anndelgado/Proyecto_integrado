import { apiFetch } from "../http.js";

const URL = "/api/instituciones";

export async function getInstituciones() {

    const response = await apiFetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo instituciones.");

    }

    return await response.json();

}

export async function getInstitucionById(id) {

    const response = await apiFetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Institución no encontrada.");

    }

    return await response.json();

}

export async function getInstitucionByCodigo(codigo) {

    const response = await apiFetch(`${URL}?codigo=${encodeURIComponent(codigo)}`);

    if (!response.ok) {

        throw new Error("Error buscando la institución.");

    }

    const instituciones = await response.json();

    return instituciones[0] || null;

}
export async function createInstitucion(institucion) {

    const response = await apiFetch(URL, {

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
export async function updateInstitucion(id, institucion) {

    const response = await apiFetch(`${URL}/${id}`, {

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

export async function deleteInstitucion(id) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar la institución.");

    }

    return true;

}
