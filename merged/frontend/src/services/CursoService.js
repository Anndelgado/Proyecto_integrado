// ======================================================
// CursoService.js
// Barranquilla Convive
// ======================================================

const URL = "/api/cursos";

//======================================================
// Obtener todos los cursos
//======================================================

export async function getCursos() {

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo cursos.");

    }

    return await response.json();

}
