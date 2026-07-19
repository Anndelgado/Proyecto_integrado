// ======================================================
// EstadisticasView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { ChartCard } from "../../components/dashboard/ChartCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";

import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";
import { getCursos } from "../../services/CursoService.js";
import { getAlertas } from "../../services/AlertaService.js";

export async function EstadisticasView() {

    const session = getSession() || {};

    const [usuarios, cursos, alertasTodas] = await Promise.all([

        getUsers().catch(() => []),

        getCursos().catch(() => []),

        getAlertas().catch(() => [])

    ]);

    const estudiantes = usuarios.filter(

        usuario =>
            usuario.rol === "estudiante" &&
            usuario.institucionId === session.institucionId

    );

    const cursosDeInstitucion = cursos.filter(

        curso => curso.institucionId === session.institucionId

    );

    const cursosPorId = cursos.reduce((acc, curso) => {

        acc[curso.id] = curso;

        return acc;

    }, {});

    const alertas = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const porNivel = alertas.reduce((acc, a) => {

        acc[a.nivelRiesgo] = (acc[a.nivelRiesgo] ?? 0) + 1;

        return acc;

    }, {});

    const resueltas = alertas.filter(a => a.estado === "resuelto").length;

    const tasaResolucion = alertas.length
        ? Math.round((resueltas / alertas.length) * 100)
        : 0;

    const porCurso = estudiantes.reduce((acc, estudiante) => {

        const nombreCurso = cursosPorId[estudiante.cursoId]?.nombre ?? "Sin curso";

        acc[nombreCurso] = (acc[nombreCurso] ?? 0) + 1;

        return acc;

    }, {});

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

            title: "Estadísticas",

            subtitle: "Indicadores de tus estudiantes y las alertas reportadas.",

            icon: "chart-column"

        })

    );

    //==================================================
    // Estadísticas principales
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

            title: "Cursos a Cargo",

            value: String(cursosDeInstitucion.length),

            icon: "chalkboard-user",

            color: "yellow"

        }),

        StatCard({

            title: "Alertas Reportadas",

            value: String(alertas.length),

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Tasa de Resolución",

            value: `${tasaResolucion}%`,

            icon: "circle-check",

            color: "green"

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Gráficas
    //==================================================

    const chartsGrid = document.createElement("section");

    chartsGrid.className = `
        grid
        gap-6
        xl:grid-cols-2
    `;

    chartsGrid.append(

        ChartCard({

            title: "Alertas por Nivel de Riesgo",

            subtitle: `Alto: ${porNivel.alto ?? 0} · Medio: ${porNivel.medio ?? 0} · Bajo: ${porNivel.bajo ?? 0}`

        }),

        ChartCard({

            title: "Evolución Mensual",

            subtitle: "Comparativo de alertas durante el año"

        })

    );

    page.appendChild(chartsGrid);

    //==================================================
    // Estudiantes por curso
    //==================================================

    page.appendChild(

        TableCard({

            title: "Estudiantes por Curso",

            subtitle: "Distribución de tus estudiantes",

            headers: [

                "Curso",

                "Estudiantes"

            ],

            rows: Object.entries(porCurso).map(([curso, total]) => [

                curso,

                String(total)

            ]),

            emptyMessage: "Aún no tienes estudiantes asignados."

        })

    );

    //==================================================

    return DashboardLayout({

        activePath: "/docente/estadisticas",

        title: "Estadísticas",

        content: page

    });

}
