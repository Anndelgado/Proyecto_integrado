import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { getUsers } from "../../services/UserService.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getInstituciones } from "../../services/InstitucionService.js";
export async function ReportesView() {

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Reportes",

            subtitle: "Genera y descarga reportes del sistema para la Secretaría de Educación y de Salud.",

            icon: "file-lines"

        })

    );

    const reportsGrid = document.createElement("section");

    reportsGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
    `;

    reportsGrid.append(

        QuickActionCard({

            title: "Reporte de Usuarios",

            description: "Listado completo de usuarios con su rol y estado.",

            icon: "users",

            color: "blue",

            async onClick() {

                const usuarios = await getUsers().catch(() => []);

                downloadCSV(

                    "reporte-usuarios",

                    ["Nombre", "Documento", "Correo", "Rol", "Estado"],

                    usuarios.map(u => [u.nombre, u.documento, u.correo, u.rol, u.estado])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte de Alertas",

            description: "Alertas registradas con su nivel de riesgo y estado.",

            icon: "triangle-exclamation",

            color: "red",

            async onClick() {

                const alertas = await getAlertas().catch(() => []);

                downloadCSV(

                    "reporte-alertas",

                    ["ID", "Nivel de Riesgo", "Estado", "Fecha"],

                    alertas.map(a => [a.id, a.nivelRiesgo, a.estado, a.fecha])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte de Instituciones",

            description: "Instituciones vinculadas al sistema distrital.",

            icon: "school",

            color: "yellow",

            async onClick() {

                const instituciones = await getInstituciones().catch(() => []);

                downloadCSV(

                    "reporte-instituciones",

                    ["Código", "Nombre", "Localidad", "Teléfono"],

                    instituciones.map(i => [i.codigo, i.nombre, i.localidad, i.telefono])

                );

            }

        }),

        QuickActionCard({

            title: "Reporte Consolidado",

            description: "Resumen general con usuarios, alertas e instituciones.",

            icon: "file-export",

            color: "green",

            async onClick() {

                const [usuarios, alertas, instituciones] = await Promise.all([

                    getUsers().catch(() => []),

                    getAlertas().catch(() => []),

                    getInstituciones().catch(() => [])

                ]);

                downloadCSV(

                    "reporte-consolidado",

                    ["Indicador", "Valor"],

                    [

                        ["Usuarios totales", usuarios.length],

                        ["Alertas totales", alertas.length],

                        ["Instituciones totales", instituciones.length]

                    ]

                );

            }

        })

    );

    page.appendChild(reportsGrid);
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
                    "Reporte de Usuarios",
                    "Administrador",
                    "14/07/2026",
                    "CSV"
                ],

                [
                    "Reporte de Alertas",
                    "Administrador",
                    "10/07/2026",
                    "CSV"
                ],

                [
                    "Reporte Consolidado",
                    "Administrador",
                    "01/07/2026",
                    "CSV"
                ]

            ],

            emptyMessage: "Aún no se han generado reportes."

        })

    );
    return DashboardLayout({

        activePath: "/admin/reportes",

        title: "Reportes",

        content: page

    });

}
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
