import { apiFetch } from "../http.js";
const URL = "/api/users";
export async function getUsers() {
    const response = await apiFetch(URL);
    if (!response.ok) {
        throw new Error("Error obteniendo usuarios.");
    }
    return await response.json();
}

export async function getUserById(id) {

    const response = await apiFetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Usuario no encontrado.");

    }
    return await response.json();
}
export async function createUser(user) {
    const response = await apiFetch(URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(user)

    });

    if (!response.ok) {

        throw new Error("No se pudo crear el usuario.");

    }

    return await response.json();

}
export async function updateUser(id, user) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(user)

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar.");

    }

    return await response.json();

}

export async function deleteUser(id) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar.");

    }

    return true;

}

export async function approveUser(id) {

    const user = await getUserById(id);

    user.estado = "activo";

    return await updateUser(

        id,

        user

    );

}
export async function assignRole(id, rol) {

    const user = await getUserById(id);

    user.rol = rol;

    return await updateUser(

        id,

        user

    );

}