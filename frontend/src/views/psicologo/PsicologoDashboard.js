import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { Badge } from "../../components/ui/Badge.js";
import { getSession } from "../../session.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import { getInstituciones } from "../../services/InstitucionService.js";
import { navigate } from "../../router.js";
const NIVEL_VARIANT = {

    alto: "danger",

    medio: "warning",

    bajo: "success"

};

const NIVEL_LABEL = {

    alto: "Alto",

    medio: "Medio",

    bajo: "Bajo"

};

const ESTADO_LABEL = {

    pendiente: "Pendiente",

    "en seguimiento": "En seguimiento",

    resuelto: "Resuelto"

};

export async function PsicologoDashboard() {

    const session = getSession() || {};

    const [alertasTodas, usuarios, instituciones] = await Promise.all([

        getAlertas().catch(() => []),

        getUsers().catch(() => []),

        getInstituciones().catch(() => [])

    ]);

    const casos = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const usuariosPorId = usuarios.reduce((acc, usuario) => {

        acc[usuario.id] = usuario;

        return acc;

    }, {});

    const institucionesPorId = instituciones.reduce((acc, institucion) => {

        acc[institucion.id] = institucion;

        return acc;

    }, {});

    const casoAltoPrioridad = [...casos]
        .filter(c => c.estado !== "resuelto")
        .sort((a, b) => (a.nivelRiesgo === "alto" ? -1 : 1))[0];

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Bienvenido, Psicólogo",

            subtitle:
                "Resumen de los casos a tu cargo. Desde aquí puedes hacer seguimiento, agendar citas y generar reportes.",

            icon: "notes-medical"

        })

    );
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

            value: String(casos.filter(c => c.estado !== "resuelto").length),

            icon: "folder-open",

            color: "blue"

        }),

        StatCard({

            title: "Casos de Alto Riesgo",

            value: String(casos.filter(c => c.nivelRiesgo === "alto").length),

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Seguimientos Pendientes",

            value: String(casos.filter(c => c.estado === "pendiente").length),

            icon: "notes-medical",

            color: "yellow"

        }),

        StatCard({

            title: "Casos Resueltos",

            value: String(casos.filter(c => c.estado === "resuelto").length),

            icon: "circle-check",

            color: "green"

        })

    );

    page.appendChild(statsGrid);
    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

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

            rows: casos.slice(0, 5).map(caso => {

                const estudiante = usuariosPorId[caso.estudianteId];

                return [

                    estudiante
                        ? `${estudiante.nombre} ${estudiante.apellido}`
                        : "Estudiante no disponible",

                    institucionesPorId[caso.institucionId]?.nombre ?? "—",

                    Badge({

                        text: NIVEL_LABEL[caso.nivelRiesgo] ?? caso.nivelRiesgo,

                        variant: NIVEL_VARIANT[caso.nivelRiesgo] ?? "neutral"

                    }),

                    ESTADO_LABEL[caso.estado] ?? caso.estado,

                    verBoton(caso.id)

                ];

            }),

            emptyMessage: "No tienes casos asignados por el momento."

        })

    );

    bottomGrid.appendChild(tableContainer);
    const actionsContainer = document.createElement("div");

    actionsContainer.className = `
        flex
        flex-col
        gap-5
    `;

    const estudiantePrioritario = casoAltoPrioridad
        ? usuariosPorId[casoAltoPrioridad.estudianteId]
        : null;

    actionsContainer.append(

        QuickActionCard({

            title: "Ver Caso Prioritario",

            description: casoAltoPrioridad
                ? `Revisa el caso #${casoAltoPrioridad.id} de ${estudiantePrioritario?.nombre ?? "un estudiante"}, nivel de riesgo ${NIVEL_LABEL[casoAltoPrioridad.nivelRiesgo]?.toLowerCase() ?? casoAltoPrioridad.nivelRiesgo}.`
                : "No tienes casos pendientes por revisar en este momento.",

            icon: "folder-open",

            color: "red",

            onClick() {

                if (casoAltoPrioridad) {

                    navigate(`/psicologo/casos/${casoAltoPrioridad.id}`);

                } else {

                    navigate("/psicologo/casos");

                }

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

    return DashboardLayout({

        activePath: "/psicologo",

        title: "Bienvenido, Psicólogo",

        content: page

    });

}
