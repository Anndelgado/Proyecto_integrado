// ======================================================
// ResultadoService.js
// Barranquilla Convive
// ======================================================
//
// Gestiona los resultados que un estudiante obtiene al completar un
// test asignado.
//
// ======================================================

const URL = "http://localhost:3000/resultados";

//======================================================
// Obtener resultados (con filtros opcionales, más recientes primero)
//
// Ej: getResultados({ estudianteId: 2 })
//======================================================

export async function getResultados(filtros = {}) {

    const params = new URLSearchParams({

        _sort: "fecha",

        _order: "desc",

        ...filtros

    }).toString();

    const response = await fetch(`${URL}?${params}`);

    if (!response.ok) {

        throw new Error("Error obteniendo los resultados.");

    }

    return await response.json();

}

//======================================================
// Obtener un resultado por id
//======================================================

export async function getResultadoById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Resultado no encontrado.");

    }

    return await response.json();

}

//======================================================
// Registrar el resultado de un test completado
//======================================================

export async function createResultado(resultado) {

    const response = await fetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(resultado)

    });

    if (!response.ok) {

        throw new Error("No se pudo registrar el resultado.");

    }

    return await response.json();

}
