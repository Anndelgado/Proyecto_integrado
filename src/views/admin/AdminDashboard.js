// ======================================================
// AdminDashboard.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";

import { PageHeader } from "../../components/layout/PageHeader.js";

import { StatCard } from "../../components/dashboard/StatCard.js";
import { ChartCard } from "../../components/dashboard/ChartCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";

export function AdminDashboard() {

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

            title: "Panel Administrativo",

            subtitle:
                "Bienvenido al panel principal de Barranquilla Convive. Desde aquí podrás gestionar usuarios, instituciones educativas, alertas, reportes y supervisar el estado general del sistema."

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

            title: "Usuarios",

            value: "1.248",

            icon: "users",

            color: "blue",

            percentage: "+12%",

            trend: "up"

        }),

        StatCard({

            title: "Alertas Activas",

            value: "46",

            icon: "triangle-exclamation",

            color: "red",

            percentage: "+8%",

            trend: "up"

        }),

        StatCard({

            title: "Instituciones",

            value: "35",

            icon: "school",

            color: "yellow",

            percentage: "+2%",

            trend: "up"

        }),

        StatCard({

            title: "Casos Cerrados",

            value: "318",

            icon: "circle-check",

            color: "green",

            percentage: "+18%",

            trend: "up"

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

            title: "Alertas por Nivel",

            subtitle: "Distribución general de alertas"

        }),

        ChartCard({

            title: "Alertas Mensuales",

            subtitle: "Comparativo durante el año"

        })

    );

    page.appendChild(chartsGrid);

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
    // Tabla
    //===========================================

    const tableContainer = document.createElement("div");

    tableContainer.className = `
        xl:col-span-2
    `;

    tableContainer.appendChild(

        TableCard({

            title: "Últimas Alertas Registradas",

            subtitle: "Casos reportados recientemente",

            headers: [

                "Estudiante",

                "Institución",

                "Nivel",

                "Estado"

            ],

            rows: [

                [

                    "Laura Gómez",

                    "IED Simón Bolívar",

                    "🔴 Alto",

                    "Pendiente"

                ],

                [

                    "Juan Pérez",

                    "IED La Salle",

                    "🟡 Medio",

                    "En seguimiento"

                ],

                [

                    "María Rodríguez",

                    "IED María Cano",

                    "🟢 Bajo",

                    "Resuelto"

                ],

                [

                    "Carlos Díaz",

                    "IED Técnica",

                    "🔴 Alto",

                    "Pendiente"

                ],

                [

                    "Ana Torres",

                    "IED San José",

                    "🟢 Bajo",

                    "Finalizado"

                ]

            ]

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

            title: "Crear Usuario",

            description: "Registrar un nuevo usuario dentro del sistema.",

            icon: "user-plus",

            color: "blue"

        }),

        QuickActionCard({

            title: "Asignar Roles",

            description: "Definir si el usuario será profesor o psicólogo.",

            icon: "user-shield",

            color: "yellow"

        }),

        QuickActionCard({

            title: "Registrar Institución",

            description: "Agregar una nueva institución educativa.",

            icon: "school",

            color: "green"

        }),

        QuickActionCard({

            title: "Generar Reporte",

            description: "Consultar indicadores y estadísticas.",

            icon: "chart-column",

            color: "red"

        })

    );

    bottomGrid.appendChild(actionsContainer);

    page.appendChild(bottomGrid);
        //==================================================
    // Actividad reciente + Estado del sistema
    //==================================================

    const infoGrid = document.createElement("section");

    infoGrid.className = `
        grid
        gap-6
        xl:grid-cols-2
    `;

    //===========================================
    // Actividad reciente
    //===========================================

    infoGrid.appendChild(

        TableCard({

            title: "Actividad Reciente",

            subtitle: "Últimos movimientos registrados en el sistema",

            headers: [

                "Hora",

                "Actividad",

                "Usuario"

            ],

            rows: [

                [

                    "10:15",

                    "Se registró una nueva alerta.",

                    "Profesor Carlos Ruiz"

                ],

                [

                    "09:42",

                    "Nuevo usuario registrado.",

                    "Laura Gómez"

                ],

                [

                    "09:15",

                    "Se asignó el rol Psicólogo.",

                    "Administrador"

                ],

                [

                    "08:58",

                    "Institución actualizada.",

                    "Administrador"

                ],

                [

                    "08:25",

                    "Caso cerrado correctamente.",

                    "Psicóloga María Pérez"

                ]

            ]

        })

    );

    //===========================================
    // Estado general
    //===========================================

    infoGrid.appendChild(

        TableCard({

            title: "Estado del Sistema",

            subtitle: "Monitoreo general",

            headers: [

                "Servicio",

                "Estado"

            ],

            rows: [

                [

                    "API",

                    "🟢 Operativa"

                ],

                [

                    "Base de datos",

                    "🟢 Conectada"

                ],

                [

                    "Servidor",

                    "🟢 En línea"

                ],

                [

                    "Usuarios conectados",

                    "142"

                ],

                [

                    "Última sincronización",

                    "Hace 2 minutos"

                ]

            ]

        })

    );

    page.appendChild(infoGrid);

    //==================================================
    // Footer Dashboard
    //==================================================

    const footer = document.createElement("footer");

    footer.className = `
        rounded-3xl
        bg-white
        p-6
        text-center
        text-sm
        text-slate-500
        shadow-sm
    `;

    footer.innerHTML = `
        <p>
            Barranquilla Convive · Sistema Distrital de Alertas Tempranas
        </p>

        <p class="mt-2">
            Secretaría de Educación Distrital · Secretaría de Salud
        </p>
    `;

    page.appendChild(footer);

    return DashboardLayout({

        activePath: "/admin",

        title: "Panel Administrativo",

        content: page

    });

}