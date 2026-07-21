import {

    getInstituciones,

    createInstitucion,

    updateInstitucion,

    deleteInstitucion

} from "../services/InstitucionService.js";

import { openInstitucionModal } from "../views/admin/InstitucionModal.js";

export class InstitucionController {

    constructor() {

        this.instituciones = [];

    }
    async loadInstituciones() {

        try {

            this.instituciones = await getInstituciones();

            return this.instituciones;

        }

        catch (error) {

            console.error(error);

            return [];

        }

    }

    async create() {

        openInstitucionModal({

            onSave: async (data) => {

                await createInstitucion(data);

                location.reload();

            }

        });

    }

    async edit(institucion) {

        openInstitucionModal({

            institucion,

            onSave: async (data) => {

                await updateInstitucion(

                    institucion.id,

                    {

                        ...institucion,

                        ...data

                    }

                );

                location.reload();

            }

        });

    }

    async remove(id) {

        const confirmed = confirm(

            "¿Deseas eliminar esta institución? Esta acción no se puede deshacer."

        );

        if (!confirmed) return;

        await deleteInstitucion(id);

        location.reload();

    }

}
