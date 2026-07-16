// ======================================================
// PsicologoDashboard.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";

import { PageHeader } from "../../components/layout/PageHeader.js";

import { StatCard } from "../../components/dashboard/StatCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { Badge } from "../../components/ui/Badge.js";

import { navigate } from "../../router.js";

export function PsicologoDashboard() {

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Header
    //==================================================

    page.appendChild(

        PageHeader({

            title: "Bienvenido, Psicólogo",

            subtitle:
                "Resumen de los casos a tu cargo. Desde aquí puedes hacer seguimiento, agendar citas y generar reportes.",

            icon: "notes-medical"

        })

    );

    //==================================================
    // Estadísticas
    //==================================================

    const statsGrid = document.createElement("section");

    statsGrid.className = `
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
    `;

    statsGrid.append(

        StatCard({

            title: "Casos Activos",

            value: "18",

            icon: "folder-open",

            color: "blue"

        }),

        StatCard({

            title: "Casos de Alto Riesgo",

            value: "5",

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Seguimientos Pendientes",

            value: "9",

            icon: "notes-medical",

            color: "yellow"

        }),

        StatCard({

            title: "Citas Hoy",

            value: "4",

            icon: "calendar-days",

            color: "green"

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Tabla de casos + Acciones rápidas
    //==================================================

    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

    const niveles = {

        "Alto": "danger",

        "Medio": "warning",

        "Bajo": "success"

    };

    function verBoton(caseId) {

        const button = document.createElement("button");

        button.type = "button";

        button.className = `
            rounded-lg
            px-3
            py-2
            text-xs
            font-semibold
            text-yellow-600
            transition
            hover:bg-yellow-50
        `;

        button.innerHTML = `Ver caso <i class="fa-solid fa-arrow-right ml-1"></i>`;

        button.addEventListener("click", () => {

            navigate(`/psicologo/casos/${caseId}`);

        });

        return button;

    }

    const casos = [

        [1256, "Andrés Duarte", "IED La Concepción", "Alto", "Pendiente"],

        [1255, "Samuel Ortega", "IED Jorge Robledo", "Medio", "En seguimiento"],

        [1254, "Laura Mendoza", "IED San José", "Alto", "Pendiente"],

        [1253, "Valentina Ruiz", "IED La Concepción", "Bajo", "Resuelto"],

        [1252, "María José Torres", "IED Metropolitana", "Bajo", "Resuelto"]

    ];

    const tableContainer = document.createElement("div");

    tableContainer.className = `
        xl:col-span-2
    `;

    tableContainer.appendChild(

        TableCard({

            title: "Mis Casos",

            subtitle: "Casos asignados según nivel de riesgo",

            headers: [

                "Estudiante",

                "Institución",

                "Nivel",

                "Estado",

                ""

            ],

            rows: casos.map(([id, nombre, institucion, nivel, estado]) => [

                nombre,

                institucion,

                Badge({ text: nivel, variant: niveles[nivel] }),

                estado,

                verBoton(id)

            ])

        })

    );

    bottomGrid.appendChild(tableContainer);

    //===========================================
    // Acciones rápidas
    //===========================================

    const actionsContainer = document.createElement("div");

    actionsContainer.className = `
        flex
        flex-col
        gap-5
    `;

    actionsContainer.append(

        QuickActionCard({

            title: "Ver Caso Prioritario",

            description: "Revisa el caso #1256 de Andrés Duarte, nivel de riesgo alto.",

            icon: "folder-open",

            color: "red",

            onClick() {

                navigate("/psicologo/casos/1256");

            }

        }),

        QuickActionCard({

            title: "Programar Seguimiento",

            description: "Agenda una sesión de seguimiento con un estudiante.",

            icon: "calendar-plus",

            color: "yellow",

            onClick() {

                navigate("/psicologo/agenda");

            }

        }),

        QuickActionCard({

            title: "Generar Reporte",

            description: "Consulta indicadores de tus casos asignados.",

            icon: "file-lines",

            color: "blue",

            onClick() {

                navigate("/psicologo/reportes");

            }

        })

    );

    bottomGrid.appendChild(actionsContainer);

    page.appendChild(bottomGrid);

    //==================================================

    return DashboardLayout({

        activePath: "/psicologo",

        title: "Bienvenido, Psicólogo",

        content: page

    });

}
