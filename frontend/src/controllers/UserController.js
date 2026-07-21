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
    async create() {

        openUserModal({

            onSave: async (data) => {

                await createUser(data);

                location.reload();

            }

        });

    }
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
    async approve(id) {

        await approveUser(id);

        location.reload();

    }
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
    async remove(id) {

        const ok = confirm(

            "¿Eliminar este usuario?"

        );

        if (!ok) return;

        await deleteUser(id);

        location.reload();

    }

}