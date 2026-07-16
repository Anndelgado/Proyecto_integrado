// ======================================================
// AuthService.js
// Barranquilla Convive
// ======================================================

import {

    getUsers,

    createUser

} from "./UserService.js";

//======================================================
// Login
//======================================================

export async function login(

    documento,

    password

) {

    const users = await getUsers();

    const user = users.find(

        user =>

            user.documento === documento &&

            user.password === password

    );

    if (!user) {

        throw new Error(

            "Documento o contraseña incorrectos."

        );

    }

    return user;

}

//======================================================
// Registro
//======================================================

export async function register(data) {

    return await createUser({

        ...data,

        rol: "estudiante",

        estado: "pendiente"

    });

}