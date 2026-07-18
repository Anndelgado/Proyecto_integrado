// ======================================================
// CitaService.js
// Barranquilla Convive
// ======================================================

const URL = "/api/citas";

//======================================================
// Obtener las citas de un psicólogo (ordenadas por fecha/hora)
//======================================================

export async function getCitas(psicologoId) {

    const response = await fetch(`${URL}?psicologoId=${psicologoId}&_sort=fecha,hora&_order=asc,asc`);

    if (!response.ok) {

        throw new Error("Error obteniendo las citas.");

    }

    return await response.json();

}

//======================================================
// Crear una cita
//======================================================

export async function createCita(cita) {

    const response = await fetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(cita)

    });

    if (!response.ok) {

        throw new Error("No se pudo programar la cita.");

    }

    return await response.json();

}

//======================================================
// Eliminar una cita
//======================================================

export async function deleteCita(id) {

    const response = await fetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar la cita.");

    }

    return true;

}
