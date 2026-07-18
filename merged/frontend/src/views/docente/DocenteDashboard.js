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

import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";
import { getCursos } from "../../services/CursoService.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getHabilitaciones, getResultados } from "../../services/TamizajeService.js";

const ESTADO_POR_NIVEL = {

    Bajo: { texto: "Estable", variant: "success" },

    Medio: { texto: "En riesgo", variant: "warning" },

    Alto: { texto: "En riesgo alto", variant: "danger" }

};

export async function DocenteDashboard() {

    const session = getSession() || {};

    const [usuarios, cursos, alertasTodas, habilitacionesTodas, resultadosTodos] = await Promise.all([

        getUsers().catch(() => []),

        getCursos().catch(() => []),

        getAlertas().catch(() => []),

        getHabilitaciones().catch(() => []),

        getResultados().catch(() => [])

    ]);

    const estudiantes = usuarios.filter(

        usuario =>
            usuario.rol === "estudiante" &&
            usuario.institucionId === session.institucionId

    );

    const estudiantesIds = new Set(estudiantes.map(e => e.id));

    const cursosPorId = cursos.reduce((acc, curso) => {

        acc[curso.id] = curso;

        return acc;

    }, {});

    const alertasInstitucion = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const alertasAbiertas = alertasInstitucion.filter(a => a.estado !== "resuelto");

    const casosAltoRiesgo = alertasInstitucion.filter(

        a => a.nivelRiesgo === "alto" && a.estado !== "resuelto"

    );

    const tamizajesPendientes = habilitacionesTodas.filter(

        h => h.estado === "activa" && estudiantesIds.has(h.estudianteId)

    );

    // El resultado más reciente por estudiante (la colección ya viene
    // ordenada de más nuevo a más antiguo, ver TamizajeService.js).
    const ultimoResultadoPorEstudiante = {};

    resultadosTodos.forEach(resultado => {

        if (!(resultado.estudianteId in ultimoResultadoPorEstudiante)) {

            ultimoResultadoPorEstudiante[resultado.estudianteId] = resultado;

        }

    });

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

            value: String(estudiantes.length),

            icon: "user-graduate",

            color: "blue"

        }),

        StatCard({

            title: "Alertas Abiertas",

            value: String(alertasAbiertas.length),

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Tamizajes Pendientes",

            value: String(tamizajesPendientes.length),

            icon: "clipboard-check",

            color: "yellow"

        }),

        StatCard({

            title: "Casos de Alto Riesgo",

            value: String(casosAltoRiesgo.length),

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

    function verIcon(estudianteId) {

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

        icon.addEventListener("click", () => {

            navigate("/docente/estudiantes");

        });

        return icon;

    }

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

                "Último tamizaje",

                "Acciones"

            ],

            rows: estudiantes.slice(0, 5).map(estudiante => {

                const resultado = ultimoResultadoPorEstudiante[estudiante.id];

                const estado = resultado
                    ? (ESTADO_POR_NIVEL[resultado.nivel] ?? { texto: resultado.nivel, variant: "neutral" })
                    : { texto: "Sin evaluar", variant: "neutral" };

                return [

                    `${estudiante.nombre} ${estudiante.apellido}`,

                    cursosPorId[estudiante.cursoId]?.nombre ?? "—",

                    Badge({ text: estado.texto, variant: estado.variant }),

                    resultado?.fecha ?? "—",

                    verIcon(estudiante.id)

                ];

            }),

            emptyMessage: "No tienes estudiantes asignados por el momento."

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
