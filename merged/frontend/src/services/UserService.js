// ======================================================
// UserService.js
// Barranquilla Convive
// ======================================================

const URL = "/api/users";

//======================================================
// Obtener todos los usuarios
//======================================================

export async function getUsers() {

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error("Error obteniendo usuarios.");

    }

    return await response.json();

}

//======================================================
// Obtener un usuario
//======================================================

export async function getUserById(id) {

    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {

        throw new Error("Usuario no encontrado.");

    }

    return await response.json();

}

//======================================================
// Crear usuario
//======================================================

export async function createUser(user) {

    const response = await fetch(URL, {

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

//======================================================
// Actualizar usuario
//======================================================

export async function updateUser(id, user) {

    const response = await fetch(`${URL}/${id}`, {

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

//======================================================
// Eliminar usuario
//======================================================

export async function deleteUser(id) {

    const response = await fetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!response.ok) {

        throw new Error("No se pudo eliminar.");

    }

    return true;

}

//======================================================
// Aprobar usuario
//======================================================

export async function approveUser(id) {

    const user = await getUserById(id);

    user.estado = "activo";

    return await updateUser(

        id,

        user

    );

}

//======================================================
// Cambiar rol
//======================================================

export async function assignRole(id, rol) {

    const user = await getUserById(id);

    user.rol = rol;

    return await updateUser(

        id,

        user

    );

}