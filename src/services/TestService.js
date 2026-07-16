// ======================================================
// TestService.js
// Barranquilla Convive
// ======================================================

const URL = "http://localhost:3000/tests";

//======================================================
// Obtener el catálogo completo de test
//======================================================

export async function getTests() {

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo el catálogo de test.");

    }

    return await response.json();

}

//======================================================
// Obtener un test por id
//======================================================

export async function getTestById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Test no encontrado.");

    }

    return await response.json();

}
