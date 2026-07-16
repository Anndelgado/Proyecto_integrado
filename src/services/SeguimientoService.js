// ======================================================
// SeguimientoService.js
// Barranquilla Convive
// ======================================================

const URL = "http://localhost:3000/seguimientos";

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
