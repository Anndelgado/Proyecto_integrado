// ======================================================
// InstitucionTable.js
// Barranquilla Convive
// ======================================================

import { TableCard } from "../../components/dashboard/TableCard.js";

export function InstitucionTable({

    instituciones = [],

    cursosPorInstitucion = {},

    onEdit = () => {},

    onDelete = () => {}

} = {}) {

    const table = TableCard({

        title: "Instituciones registradas",

        subtitle: `${instituciones.length} instituciones encontradas`,

        headers: [

            "Código",

            "Institución",

            "Localidad",

            "Teléfono",

            "Cursos",

            "Acciones"

        ],

        rows: instituciones.map(institucion => [

            `
            <span
                class="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-slate-700
                "
            >
                ${institucion.codigo}
            </span>
            `,

            `
            <div>

                <p class="font-semibold text-navy-900">

                    ${institucion.nombre}

                </p>

                <p class="mt-1 text-xs text-slate-400">

                    ${institucion.direccion}

                </p>

            </div>
            `,

            institucion.localidad,

            institucion.telefono,

            String(cursosPorInstitucion[institucion.id] ?? 0),

            actions(institucion)

        ])

    });

    //==================================================
    // Delegación de eventos para las acciones
    //==================================================

    function findInstitucion(id) {

        return instituciones.find(
            i => String(i.id) === String(id)
        );

    }

    table.addEventListener(

        "click",

        (event) => {

            const editBtn = event.target.closest(".edit-institucion");

            if (editBtn) {

                onEdit(findInstitucion(editBtn.dataset.id));

                return;

            }

            const deleteBtn = event.target.closest(".delete-institucion");

            if (deleteBtn) {

                onDelete(deleteBtn.dataset.id);

                return;

            }

        }

    );

    return table;

}

//==================================================

function actions(institucion) {

    return `

        <div class="flex gap-2">

            <button

                class="
                    edit-institucion
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${institucion.id}"

                title="Editar institución"

            >

                <i class="fa-solid fa-pen"></i>

            </button>

            <button

                class="
                    delete-institucion
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${institucion.id}"

                title="Eliminar institución"

            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;

}
