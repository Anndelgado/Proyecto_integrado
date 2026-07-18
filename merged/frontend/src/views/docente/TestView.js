// ======================================================
// TestView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Badge } from "../../components/ui/Badge.js";

import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";

const TIPOS_DE_TEST = [

    {
        nombre: "Cuestionario de Bienestar Emocional",
        descripcion: "Evalúa el estado emocional general del estudiante.",
        icon: "face-smile",
        color: "blue"
    },

    {
        nombre: "Escala de Convivencia Escolar",
        descripcion: "Mide la percepción del estudiante sobre el ambiente escolar.",
        icon: "people-group",
        color: "yellow"
    },

    {
        nombre: "Cuestionario de Detección Temprana",
        descripcion: "Identifica señales tempranas de riesgo psicosocial.",
        icon: "magnifying-glass-chart",
        color: "red"
    }

];

export async function TestView() {

    const session = getSession() || {};

    const usuarios = await getUsers().catch(() => []);

    const estudiantes = usuarios.filter(

        usuario =>
            usuario.rol === "estudiante" &&
            usuario.institucionId === session.institucionId

    );

    // Registro de asignaciones (solo en memoria, no persiste en el backend).
    const asignaciones = [];

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Encabezado
    //==================================================

    page.appendChild(

        PageHeader({

            title: "Test Psicosociales",

            subtitle: "Asigna test a tus estudiantes para hacer seguimiento a su bienestar emocional.",

            icon: "clipboard-check",

            stats: [

                { label: "Test disponibles", value: TIPOS_DE_TEST.length },

                { label: "Estudiantes a cargo", value: estudiantes.length }

            ]

        })

    );

    //==================================================
    // Test disponibles
    //==================================================

    const testsGrid = document.createElement("section");

    testsGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    TIPOS_DE_TEST.forEach(test => {

        testsGrid.appendChild(

            QuickActionCard({

                title: test.nombre,

                description: test.descripcion,

                icon: test.icon,

                color: test.color,

                onClick() {

                    asignarTest(test);

                }

            })

        );

    });

    page.appendChild(testsGrid);

    //==================================================
    // Historial de asignaciones
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            TableCard({

                title: "Test Asignados",

                subtitle: "Asignaciones registradas en esta sesión",

                headers: [

                    "Test",

                    "Estudiante",

                    "Fecha",

                    "Estado"

                ],

                rows: asignaciones.map(asignacion => [

                    asignacion.test,

                    asignacion.estudiante,

                    asignacion.fecha,

                    Badge({ text: "Pendiente", variant: "warning" })

                ]),

                emptyMessage: "Aún no has asignado ningún test."

            })

        );

    }

    function asignarTest(test) {

        if (!estudiantes.length) {

            alert("No tienes estudiantes asociados para asignar este test.");

            return;

        }

        const opciones = estudiantes
            .map((estudiante, index) => `${index + 1}. ${estudiante.nombre} ${estudiante.apellido}`)
            .join("\n");

        const seleccion = prompt(

            `¿A qué estudiante deseas asignar "${test.nombre}"?\n\n${opciones}\n\nEscribe el número del estudiante:`

        );

        const index = Number(seleccion) - 1;

        const estudiante = estudiantes[index];

        if (!estudiante) return;

        asignaciones.unshift({

            test: test.nombre,

            estudiante: `${estudiante.nombre} ${estudiante.apellido}`,

            fecha: new Date().toISOString().slice(0, 10)

        });

        renderTable();

    }

    renderTable();

    //==================================================

    return DashboardLayout({

        activePath: "/docente/test",

        title: "Test Psicosociales",

        content: page

    });

}
