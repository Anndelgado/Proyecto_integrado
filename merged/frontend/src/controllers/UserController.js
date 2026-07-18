// ======================================================
// UserController.js
// Barranquilla Convive
// ======================================================

import { openRoleModal } from "../views/admin/RoleModal.js";
import {

    getUsers,

    createUser,

    updateUser,

    deleteUser,

    approveUser,

    assignRole

} from "../services/UserService.js";

import { openUserModal } from "../views/admin/UserModal.js";

export class UserController {

    constructor() {

        this.users = [];

    }

    //=========================================
    // Obtener usuarios
    //=========================================

    async loadUsers() {

        try {

            this.users = await getUsers();

            return this.users;

        }

        catch (error) {

            console.error(error);

            return [];

        }

    }

    //=========================================
    // Crear usuario
    //=========================================

    async create() {

        openUserModal({

            onSave: async (data) => {

                await createUser(data);

                location.reload();

            }

        });

    }

    //=========================================
    // Editar usuario
    //=========================================

    async edit(user) {

        openUserModal({

            user,

            onSave: async (data) => {

                await updateUser(

                    user.id,

                    {

                        ...user,

                        ...data

                    }

                );

                location.reload();

            }

        });

    }

    //=========================================
    // Aprobar usuario
    //=========================================

    async approve(id) {

        await approveUser(id);

        location.reload();

    }

    //=========================================
    // Cambiar rol
    //=========================================

    async changeRole(user) {

    openRoleModal({

        user,

        onSave: async (rol) => {

            await assignRole(

                user.id,

                rol

            );

            location.reload();

        }

    });

}

    //=========================================
    // Eliminar
    //=========================================

    async remove(id) {

        const ok = confirm(

            "¿Eliminar este usuario?"

        );

        if (!ok) return;

        await deleteUser(id);

        location.reload();

    }

}