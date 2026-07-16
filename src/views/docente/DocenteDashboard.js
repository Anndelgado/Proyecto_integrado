// ======================================================
// DocenteDashboard.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";

import { PageHeader } from "../../components/layout/PageHeader.js";

import { StatCard } from "../../components/dashboard/StatCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";

import { navigate } from "../../router.js";

export function DocenteDashboard() {

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

            title: "Bienvenido, Profesor",

            subtitle:
                "Resumen de tu actividad. Aquí puedes revisar el estado emocional de tus estudiantes, crear alertas y asignar test.",

            icon: "chalkboard-user"

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

            title: "Mis Estudiantes",

            value: "28",

            icon: "user-graduate",

            color: "blue"

        }),

        StatCard({

            title: "Alertas Abiertas",

            value: "7",

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Test Pendientes",

            value: "12",

            icon: "clipboard-check",

            color: "yellow"

        }),

        StatCard({

            title: "Evaluaciones Pendientes",

            value: "5",

            icon: "notes-medical",

            color: "green"

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Tabla + Panel lateral
    //==================================================

    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

    //===========================================
    // Tabla de estudiantes
    //===========================================

    const estados = {

        "Estable": "success",

        "En riesgo": "warning",

        "En riesgo alto": "danger"

    };

    function verIcon() {

        const icon = document.createElement("button");

        icon.type = "button";

        icon.className = `
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-yellow-50
            hover:text-yellow-600
        `;

        icon.innerHTML = `<i class="fa-solid fa-eye"></i>`;

        return icon;

    }

    const estudiantes = [

        ["María José Torres", "9°A", "Estable", "20/05/2026"],

        ["Samuel Ortega", "9°A", "En riesgo", "18/05/2026"],

        ["Valentina Ruiz", "9°A", "Estable", "19/05/2026"],

        ["Andrés Duarte", "9°A", "En riesgo alto", "17/05/2026"],

        ["Laura Mendoza", "9°A", "Estable", "21/05/2026"]

    ];

    const tableContainer = document.createElement("div");

    tableContainer.className = `
        xl:col-span-2
    `;

    tableContainer.appendChild(

        TableCard({

            title: "Mis Estudiantes",

            subtitle: "Estado emocional y actividad reciente",

            headers: [

                "Nombre",

                "Curso",

                "Estado emocional",

                "Último test",

                "Acciones"

            ],

            rows: estudiantes.map(([nombre, curso, estado, fecha]) => [

                nombre,

                curso,

                Badge({ text: estado, variant: estados[estado] || "neutral" }),

                fecha,

                verIcon()

            ])

        })

    );

    bottomGrid.appendChild(tableContainer);

    //===========================================
    // Panel lateral: Crear alerta / Activar test
    //===========================================

    const sidePanel = document.createElement("div");

    sidePanel.className = `
        flex
        flex-col
        gap-6
    `;

    //--- Crear alerta ---

    const alertaBody = document.createElement("div");

    alertaBody.className = `
        flex
        flex-col
        gap-4
    `;

    alertaBody.innerHTML = `
        <p class="text-sm leading-6 text-slate-500">
            ¿Observaste alguna señal de alerta en un estudiante? Repórtala para que sea revisada por el equipo de orientación.
        </p>
    `;

    alertaBody.appendChild(

        Button({

            text: "Nueva alerta",

            icon: "circle-exclamation",

            variant: "primary",

            fullWidth: true,

            onClick() {

                navigate("/docente/alertas");

            }

        })

    );

    sidePanel.appendChild(

        Card({

            title: "Crear alerta",

            content: alertaBody

        })

    );

    //--- Activar test ---

    const testBody = document.createElement("div");

    testBody.className = `
        flex
        flex-col
        gap-4
    `;

    testBody.innerHTML = `
        <p class="text-sm leading-6 text-slate-500">
            Asigna un test a tus estudiantes para hacer seguimiento a su bienestar emocional.
        </p>
    `;

    testBody.appendChild(

        Button({

            text: "Activar test",

            icon: "clipboard-check",

            variant: "secondary",

            fullWidth: true,

            onClick() {

                navigate("/docente/test");

            }

        })

    );

    sidePanel.appendChild(

        Card({

            title: "Activar test",

            content: testBody

        })

    );

    bottomGrid.appendChild(sidePanel);

    page.appendChild(bottomGrid);

    //==================================================

    return DashboardLayout({

        activePath: "/docente",

        title: "Bienvenido, Profesor",

        content: page

    });

}
