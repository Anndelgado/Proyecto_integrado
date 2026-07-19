// ======================================================
// ReportesView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";

import { getSession } from "../../session.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import { getSeguimientos } from "../../services/SeguimientoService.js";
import { getResultados as getResultadosTamizaje } from "../../services/TamizajeService.js";

export async function ReportesView() {

    const session = getSession() || {};

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

            title: "Reportes",

            subtitle: "Genera y descarga reportes sobre los casos, seguimientos y tamizajes de tu institución.",

            icon: "file-lines"

        })

    );

    //==================================================
    // Helpers de datos
    //==================================================

    async function casosDelPsicologo() {

        const alertas = await getAlertas().catch(() => []);

        return alertas.filter(alerta => alerta.institucionId === session.institucionId);

    }

    async function estudiantesPorId() {

        const usuarios = await getUsers().catch(() => []);

        return usuarios.reduce((acc, usuario) => {

            acc[usuario.id] = usuario;

            return acc;

        }, {});

    }

    function nombreEstudiante(mapa, id) {

        const estudiante = mapa[id];

        return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "—";

    }

    // El psicólogo/a no gestiona el tamizaje (eso lo hace el docente),
    // pero sí necesita ver el reporte consolidado de resultados de los
    // estudiantes de su institución para dar seguimiento a los casos.
    async function resultadosTamizajeInstitucion() {

        const [resultados, usuarios] = await Promise.all([

            getResultadosTamizaje().catch(() => []),

            getUsers().catch(() => [])

        ]);

        const estudiantesInstitucion = new Set(

            usuarios

                .filter(u => u.rol === "estudiante" && u.institucionId === session.institucionId)

                .map(u => u.id)

        );

        return resultados.filter(r => estudiantesInstitucion.has(r.estudianteId));

    }

    //==================================================
    // Reportes disponibles
    //==================================================

    const reportsGrid = document.createElement("section");

    reportsGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    reportsGrid.append(

        QuickActionCard({

            title: "Reporte de Casos",

            description: "Listado de casos asignados con nivel de riesgo y estado.",

            icon: "folder-open",

            color: "red",

            async onClick() {

                const [casos, estudiantes] = await Promise.all([

                    casosDelPsicologo(),

                    estudiantesPorId()

                ]);

                downloadCSV(

                    "reporte-casos",

                    ["ID", "Estudiante", "Nivel de Riesgo", "Estado", "Fecha"],

                    casos.map(c => [

                        c.id,

                        nombreEstudiante(estudiantes, c.estudianteId),

                        c.nivelRiesgo,

                        c.estado,

                        c.fecha

                    ])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte de Seguimiento",

            description: "Historial de observaciones registradas en tus casos.",

            icon: "notes-medical",

            color: "yellow",

            async onClick() {

                const [casos, estudiantes, seguimientosTodos] = await Promise.all([

                    casosDelPsicologo(),

                    estudiantesPorId(),

                    getSeguimientos().catch(() => [])

                ]);

                const casosPorId = casos.reduce((acc, c) => {

                    acc[c.id] = c;

                    return acc;

                }, {});

                const seguimientos = seguimientosTodos.filter(s => casosPorId[s.alertaId]);

                downloadCSV(

                    "reporte-seguimiento",

                    ["Fecha", "Caso", "Estudiante", "Comentario"],

                    seguimientos.map(s => [

                        s.fecha,

                        s.alertaId,

                        nombreEstudiante(estudiantes, casosPorId[s.alertaId]?.estudianteId),

                        s.comentario

                    ])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte de Tamizajes",

            description: "Resultados de tamizaje psicológico de los estudiantes de tu institución.",

            icon: "clipboard-check",

            color: "green",

            async onClick() {

                const [resultados, estudiantes] = await Promise.all([

                    resultadosTamizajeInstitucion(),

                    estudiantesPorId()

                ]);

                downloadCSV(

                    "reporte-tamizajes",

                    ["Estudiante", "Prueba", "Fecha", "Puntaje", "Clasificación", "Nivel"],

                    resultados.map(r => [

                        nombreEstudiante(estudiantes, r.estudianteId),

                        r.testNombre,

                        r.fecha,

                        `${r.puntaje}/${r.puntajeMax}`,

                        r.clasificacion,

                        r.nivel

                    ])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte Consolidado",

            description: "Resumen general de casos por nivel de riesgo y estado.",

            icon: "file-export",

            color: "blue",

            async onClick() {

                const casos = await casosDelPsicologo();

                downloadCSV(

                    "reporte-consolidado-psicologo",

                    ["Indicador", "Valor"],

                    [

                        ["Casos totales", casos.length],

                        ["Riesgo alto", casos.filter(c => c.nivelRiesgo === "alto").length],

                        ["Riesgo medio", casos.filter(c => c.nivelRiesgo === "medio").length],

                        ["Riesgo bajo", casos.filter(c => c.nivelRiesgo === "bajo").length],

                        ["Pendientes", casos.filter(c => c.estado === "pendiente").length],

                        ["En seguimiento", casos.filter(c => c.estado === "en seguimiento").length],

                        ["Resueltos", casos.filter(c => c.estado === "resuelto").length]

                    ]

                );

            }

        })

    );

    page.appendChild(reportsGrid);

    //==================================================
    // Historial (referencial)
    //==================================================

    page.appendChild(

        TableCard({

            title: "Historial de Reportes Generados",

            subtitle: "Últimos reportes descargados desde este equipo",

            headers: [

                "Reporte",

                "Generado por",

                "Fecha",

                "Formato"

            ],

            rows: [

                [
                    "Reporte de Casos",
                    `${session.nombre ?? "Psicólogo"} ${session.apellido ?? ""}`,
                    "14/07/2026",
                    "CSV"
                ]

            ],

            emptyMessage: "Aún no se han generado reportes."

        })

    );

    //==================================================

    return DashboardLayout({

        activePath: "/psicologo/reportes",

        title: "Reportes",

        content: page

    });

}

//==================================================
// Descargar CSV
//==================================================

function downloadCSV(filename, headers, rows) {

    if (!rows.length) {

        alert("No hay información disponible para generar este reporte.");

        return;

    }

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

    link.download = `${filename}.csv`;

    link.click();

    URL.revokeObjectURL(url);

}
