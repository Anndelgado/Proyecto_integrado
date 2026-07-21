import { apiFetch } from "../http.js";

const URL = "/api/cursos";

export async function getCursos() {

    const response = await apiFetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo cursos.");

    }

    return await response.json();

}
