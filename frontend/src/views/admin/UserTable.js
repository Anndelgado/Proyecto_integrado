// ======================================================
// UserTable.js
// Barranquilla Convive
// ======================================================

import { TableCard } from "../../components/dashboard/TableCard.js";
import { normalizeRole, getRoleLabel } from "../../components/layout/navigation.js";

export function UserTable({

    users = [],

    onEdit = () => {},

    onDelete = () => {},

    onApprove = () => {},

    onRole = () => {}

} = {}) {

    const table = TableCard({

        title: "Usuarios registrados",

        subtitle: `${users.length} usuarios encontrados`,

        headers: [

            "Nombre",

            "Documento",

            "Correo",

            "Rol",

            "Estado",

            "Acciones"

        ],

        rows: users.map(user => [

            `
            <div>

                <p class="font-semibold text-navy-900">

                    ${user.nombre}

                </p>

            </div>
            `,

            user.documento,

            user.correo,

            roleBadge(user.rol),

            stateBadge(user.estado),

            actions(user)

        ])

    });

    //==================================================
    // Delegación de eventos para las acciones
    //==================================================

    function findUser(id) {

        return users.find(
            u => String(u.id) === String(id)
        );

    }

    table.addEventListener(

        "click",

        (event) => {

            const editBtn = event.target.closest(".edit-user");

            if (editBtn) {

                onEdit(findUser(editBtn.dataset.id));

                return;

            }

            const roleBtn = event.target.closest(".role-user");

            if (roleBtn) {

                onRole(findUser(roleBtn.dataset.id));

                return;

            }

            const approveBtn = event.target.closest(".approve-user");

            if (approveBtn) {

                onApprove(approveBtn.dataset.id);

                return;

            }

            const deleteBtn = event.target.closest(".delete-user");

            if (deleteBtn) {

                onDelete(deleteBtn.dataset.id);

                return;

            }

        }

    );

    return table;

}

//==================================================

function roleBadge(role){

    const rolNormalizado = normalizeRole(role);

    const colors={

        admin:"bg-red-100 text-red-700",

        docente:"bg-blue-100 text-blue-700",

        psicologo:"bg-purple-100 text-purple-700",

        estudiante:"bg-emerald-100 text-emerald-700"

    };

    return `

        <span
            class="
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${colors[rolNormalizado] || "bg-slate-100 text-slate-700"}
            "
        >

            ${getRoleLabel(role)}

        </span>

    `;

}

//==================================================

function stateBadge(state){

    const colors={

        activo:"bg-green-100 text-green-700",

        pendiente:"bg-yellow-100 text-yellow-700",

        inactivo:"bg-red-100 text-red-700"

    };

    return `

        <span
            class="
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${colors[state] || "bg-slate-100 text-slate-700"}
            "
        >

            ${state}

        </span>

    `;

}

//==================================================

function actions(user){

    return `

        <div class="flex gap-2">

            <button

                class="
                    edit-user
                    rounded-lg
                    bg-blue-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${user.id}"

                title="Editar usuario"

            >

                <i class="fa-solid fa-pen"></i>

            </button>

            <button

                class="
                    role-user
                    rounded-lg
                    bg-yellow-400
                    px-3
                    py-2
                "

                data-id="${user.id}"

                title="Cambiar rol"

            >

                <i class="fa-solid fa-user-shield"></i>

            </button>

            ${user.estado === "pendiente" ? `
            <button

                class="
                    approve-user
                    rounded-lg
                    bg-green-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${user.id}"

                title="Aprobar usuario"

            >

                <i class="fa-solid fa-check"></i>

            </button>
            ` : ""}

            <button

                class="
                    delete-user
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${user.id}"

                title="Eliminar usuario"

            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;

}