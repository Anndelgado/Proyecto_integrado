// ======================================================
// EstadisticasView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { ChartCard } from "../../components/dashboard/ChartCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";

import { getUsers } from "../../services/UserService.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getInstituciones } from "../../services/InstitucionService.js";

export async function EstadisticasView() {

    const [usuarios, alertas, instituciones] = await Promise.all([

        getUsers().catch(() => []),

        getAlertas().catch(() => []),

        getInstituciones().catch(() => [])

    ]);

    //==================================================
    // Cálculos generales
    //==================================================

    const porRol = usuarios.reduce((acc, u) => {

        acc[u.rol] = (acc[u.rol] ?? 0) + 1;

        return acc;

    }, {});

    const porNivel = alertas.reduce((acc, a) => {

        acc[a.nivelRiesgo] = (acc[a.nivelRiesgo] ?? 0) + 1;

        return acc;

    }, {});

    const resueltas = alertas.filter(a => a.estado === "resuelto").length;

    const tasaResolucion = alertas.length
        ? Math.round((resueltas / alertas.length) * 100)
        : 0;

    const porInstitucion = alertas.reduce((acc, a) => {

        acc[a.institucionId] = (acc[a.institucionId] ?? 0) + 1;

        return acc;

    }, {});

    const rankingInstituciones = instituciones
        .map(institucion => ({
            institucion,
            total: porInstitucion[institucion.id] ?? 0
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

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

            title: "Estadísticas Generales",

            subtitle: "Indicadores del sistema distrital de alertas tempranas, actualizados en tiempo real.",

            icon: "chart-line"

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

            title: "Usuarios Totales",

            value: String(usuarios.length),

            icon: "users",

            color: "blue"

        }),

        StatCard({

            title: "Instituciones",

            value: String(instituciones.length),

            icon: "school",

            color: "yellow"

        }),

        StatCard({

            title: "Alertas Registradas",

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

            title: "Usuarios por Rol",

            subtitle: `Estudiantes: ${porRol.estudiante ?? 0} · Docentes: ${porRol.docente ?? 0} · Orientadores: ${porRol.orientador ?? 0} · Admins: ${porRol.admin ?? 0}`

        })

    );

    page.appendChild(chartsGrid);

    //==================================================
    // Ranking de instituciones + Evolución mensual
    //==================================================

    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-2
    `;

    bottomGrid.append(

        TableCard({

            title: "Instituciones con más Alertas",

            subtitle: "Ranking según alertas registradas",

            headers: [

                "Institución",

                "Localidad",

                "Alertas"

            ],

            rows: rankingInstituciones.map(({ institucion, total }) => [

                institucion.nombre,

                institucion.localidad,

                String(total)

            ]),

            emptyMessage: "Aún no hay alertas registradas."

        }),

        ChartCard({

            title: "Evolución Mensual de Alertas",

            subtitle: "Comparativo de los últimos meses"

        })

    );

    page.appendChild(bottomGrid);

    //==================================================

    return DashboardLayout({

        activePath: "/admin/estadisticas",

        title: "Estadísticas Generales",

        content: page

    });

}
