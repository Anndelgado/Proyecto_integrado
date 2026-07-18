// ======================================================
// UsersView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { UserFilters } from "../../components/dashboard/UserFilters.js";
import { UserTable } from "./UserTable.js";
import { UserController } from "../../controllers/UserController.js";

export async function UsersView() {

    const controller = new UserController();

    const users = await controller.loadUsers();

    const state = {

        search: "",

        role: "",

        status: ""

    };

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Estadísticas rápidas
    //==================================================

    const pendientes = users.filter(
        user => user.estado === "pendiente"
    ).length;

    const activos = users.filter(
        user => user.estado === "activo"
    ).length;

    const docentesYOrientadores = users.filter(
        user => user.rol === "docente" || user.rol === "psicologo" || user.rol === "orientador"
    ).length;

    //==================================================
    // Encabezado
    //==================================================

    page.appendChild(

        PageHeader({

            title: "Gestión de Usuarios",

            subtitle: "Administra los usuarios registrados y asigna sus roles.",

            icon: "users",

            buttonText: "Nuevo Usuario",

            buttonIcon: "user-plus",

            onButtonClick() {

                controller.create();

            },

            stats: [

                { label: "Total de usuarios", value: users.length },

                { label: "Activos", value: activos },

                { label: "Pendientes", value: pendientes },

                { label: "Docentes / Psicólogos", value: docentesYOrientadores }

            ]

        })

    );

    //==================================================
    // Acciones rápidas
    //==================================================

    const actions = document.createElement("section");

    actions.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
    `;

    actions.append(

        QuickActionCard({

            title: "Nuevo Usuario",

            description: "Registrar un nuevo usuario.",

            icon: "user-plus",

            color: "blue",

            onClick() {

                controller.create();

            }

        }),

        QuickActionCard({

            title: "Asignar Rol",

            description: "Usa el ícono de escudo en la tabla para definir el rol de cada usuario.",

            icon: "user-shield",

            color: "yellow"

        }),

        QuickActionCard({

            title: "Pendientes",

            description: `${pendientes} usuario(s) esperando aprobación.`,

            icon: "user-clock",

            color: "green",

            onClick() {

                statusSelect.value = "pendiente";

                state.status = "pendiente";

                renderTable();

                tableContainer.scrollIntoView({ behavior: "smooth" });

            }

        }),

        QuickActionCard({

            title: "Exportar",

            description: "Exportar listado de usuarios visibles.",

            icon: "file-export",

            color: "red",

            onClick() {

                exportUsersToCSV(getFilteredUsers());

            }

        })

    );

    page.appendChild(actions);

    //==================================================
    // Filtros
    //==================================================

    const filters = UserFilters({

        onSearch(value) {

            state.search = value.trim().toLowerCase();

            renderTable();

        },

        onRole(role) {

            state.role = role;

            renderTable();

        },

        onStatus(status) {

            state.status = status;

            renderTable();

        }

    });

    page.appendChild(filters);

    const statusSelect = filters.querySelectorAll("select")[1];

    //==================================================
    // Tabla
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function getFilteredUsers() {

        return users.filter(user => {

            const matchesSearch =
                !state.search ||
                user.nombre?.toLowerCase().includes(state.search) ||
                user.correo?.toLowerCase().includes(state.search) ||
                user.documento?.toLowerCase().includes(state.search);

            const matchesRole =
                !state.role ||
                user.rol === state.role;

            const matchesStatus =
                !state.status ||
                user.estado === state.status;

            return matchesSearch && matchesRole && matchesStatus;

        });

    }

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            UserTable({

                users: getFilteredUsers(),

                onEdit(user) {

                    controller.edit(user);

                },

                onRole(user) {

                    controller.changeRole(user);

                },

                onApprove(id) {

                    controller.approve(id);

                },

                onDelete(id) {

                    controller.remove(id);

                }

            })

        );

    }

    renderTable();

    //==================================================

    return DashboardLayout({

        activePath: "/admin/usuarios",

        title: "Gestión de Usuarios",

        content: page

    });

}

//==================================================
// Exportar CSV
//==================================================

function exportUsersToCSV(users) {

    if (!users.length) {

        alert("No hay usuarios para exportar con los filtros actuales.");

        return;

    }

    const headers = [
        "Nombre",
        "Documento",
        "Correo",
        "Rol",
        "Estado"
    ];

    const rows = users.map(user => [

        user.nombre,

        user.documento,

        user.correo,

        user.rol,

        user.estado

    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "usuarios-barranquilla-convive.csv";

    link.click();

    URL.revokeObjectURL(url);

}
