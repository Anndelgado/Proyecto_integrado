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
import { Badge } from "../../components/ui/Badge.js";

import { navigate } from "../../router.js";

import { getUsers } from "../../services/UserService.js";
import { getInstituciones } from "../../services/InstitucionService.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getSeguimientos } from "../../services/SeguimientoService.js";

const NIVEL_ICONO = {

    alto: "<i class=\"fa-solid fa-circle text-red-500\"></i> Alto",

    medio: "<i class=\"fa-solid fa-circle text-yellow-500\"></i> Medio",

    bajo: "<i class=\"fa-solid fa-circle text-emerald-500\"></i> Bajo"

};

const ESTADO_LABEL = {

    pendiente: "Pendiente",

    "en seguimiento": "En seguimiento",

    resuelto: "Resuelto"

};

export async function AdminDashboard() {

    let backendDisponible = true;

    const [usuarios, instituciones, alertas, seguimientos] = await Promise.all([

        getUsers().catch(() => { backendDisponible = false; return []; }),

        getInstituciones().catch(() => { backendDisponible = false; return []; }),

        getAlertas().catch(() => { backendDisponible = false; return []; }),

        getSeguimientos().catch(() => { backendDisponible = false; return []; })

    ]);

    const usuariosPorId = usuarios.reduce((acc, usuario) => {

        acc[usuario.id] = usuario;

        return acc;

    }, {});

    const institucionesPorId = instituciones.reduce((acc, institucion) => {

        acc[institucion.id] = institucion;

        return acc;

    }, {});

    const alertasActivas = alertas.filter(a => a.estado !== "resuelto");

    const casosCerrados = alertas.filter(a => a.estado === "resuelto");

    const usuariosActivos = usuarios.filter(u => u.estado === "activo");

    // Alertas ya vienen ordenadas de más reciente a más antigua
    // (ver AlertaService.getAlertas), igual que los seguimientos.
    const ultimasAlertas = alertas.slice(0, 5);

    // -------------------------------------------------
    // Distribución de alertas por nivel de riesgo
    // -------------------------------------------------

    const conteoPorNivel = {

        alto: alertas.filter(a => a.nivelRiesgo === "alto").length,

        medio: alertas.filter(a => a.nivelRiesgo === "medio").length,

        bajo: alertas.filter(a => a.nivelRiesgo === "bajo").length

    };

    // -------------------------------------------------
    // Alertas por mes (a partir de la fecha real de cada alerta)
    // -------------------------------------------------

    const conteoPorMes = {};

    alertas.forEach(alerta => {

        const mes = (alerta.fecha ?? "").slice(0, 7); // "YYYY-MM"

        if (!mes) return;

        conteoPorMes[mes] = (conteoPorMes[mes] ?? 0) + 1;

    });

    const mesesOrdenados = Object.keys(conteoPorMes).sort();

    // -------------------------------------------------
    // Actividad reciente: combina alertas, seguimientos y
    // usuarios recién registrados en una sola línea de tiempo.
    // -------------------------------------------------

    const eventos = [];

    alertas.forEach(alerta => {

        const estudiante = usuariosPorId[alerta.estudianteId];

        eventos.push({

            fecha: alerta.fecha,

            actividad: `Nueva alerta registrada (nivel ${alerta.nivelRiesgo}).`,

            usuario: estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Estudiante no disponible"

        });

    });

    seguimientos.forEach(seguimiento => {

        const usuario = usuariosPorId[seguimiento.usuarioId];

        eventos.push({

            fecha: seguimiento.fecha,

            actividad: `Seguimiento registrado en el caso #${seguimiento.alertaId}.`,

            usuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : "Usuario no disponible"

        });

    });

    usuarios.forEach(usuario => {

        eventos.push({

            fecha: usuario.fechaRegistro,

            actividad: "Nuevo usuario registrado.",

            usuario: `${usuario.nombre} ${usuario.apellido}`

        });

    });

    const actividadReciente = eventos

        .filter(evento => evento.fecha)

        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

        .slice(0, 5);

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

            value: String(usuarios.length),

            icon: "users",

            color: "blue"

        }),

        StatCard({

            title: "Alertas Activas",

            value: String(alertasActivas.length),

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Instituciones",

            value: String(instituciones.length),

            icon: "school",

            color: "yellow"

        }),

        StatCard({

            title: "Casos Cerrados",

            value: String(casosCerrados.length),

            icon: "circle-check",

            color: "green"

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Gráficas
    //==================================================

    function barraNivel(etiqueta, cantidad, total, color) {

        const porcentaje = total ? Math.round((cantidad / total) * 100) : 0;

        const row = document.createElement("div");

        row.className = "flex flex-col gap-1";

        row.innerHTML = `
            <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-navy-900">${etiqueta}</span>
                <span class="text-slate-500">${cantidad}</span>
            </div>
            <div class="h-2.5 w-full rounded-full bg-slate-100">
                <div class="h-2.5 rounded-full ${color}" style="width: ${porcentaje}%"></div>
            </div>
        `;

        return row;

    }

    const totalAlertas = alertas.length;

    const nivelesChart = document.createElement("div");

    nivelesChart.className = "flex w-full flex-col justify-center gap-5 px-2";

    if (totalAlertas) {

        nivelesChart.append(

            barraNivel("Alto", conteoPorNivel.alto, totalAlertas, "bg-red-500"),

            barraNivel("Medio", conteoPorNivel.medio, totalAlertas, "bg-yellow-400"),

            barraNivel("Bajo", conteoPorNivel.bajo, totalAlertas, "bg-emerald-500")

        );

    } else {

        nivelesChart.innerHTML = `
            <p class="text-center text-sm text-slate-400">
                Aún no hay alertas registradas.
            </p>
        `;

    }

    const mensualChart = document.createElement("div");

    mensualChart.className = "flex h-full w-full items-end justify-center gap-4 px-2 pb-2";

    if (mesesOrdenados.length) {

        const maximo = Math.max(...mesesOrdenados.map(mes => conteoPorMes[mes]));

        mesesOrdenados.forEach(mes => {

            const cantidad = conteoPorMes[mes];

            const alturaPx = Math.max(12, Math.round((cantidad / maximo) * 200));

            const [anio, numeroMes] = mes.split("-");

            const nombreMes = new Date(`${anio}-${numeroMes}-01T00:00:00`)
                .toLocaleDateString("es-CO", { month: "short" });

            const col = document.createElement("div");

            col.className = "flex flex-col items-center gap-2";

            col.innerHTML = `
                <span class="text-xs font-semibold text-slate-500">${cantidad}</span>
                <div class="w-8 rounded-t-lg bg-yellow-400" style="height: ${alturaPx}px"></div>
                <span class="text-xs capitalize text-slate-400">${nombreMes}</span>
            `;

            mensualChart.appendChild(col);

        });

    } else {

        mensualChart.innerHTML = `
            <p class="text-center text-sm text-slate-400">
                Aún no hay alertas registradas.
            </p>
        `;

    }

    const chartsGrid = document.createElement("section");

    chartsGrid.className = `
        grid
        gap-6
        xl:grid-cols-2
    `;

    chartsGrid.append(

        ChartCard({

            title: "Alertas por Nivel",

            subtitle: "Distribución general de alertas",

            content: nivelesChart

        }),

        ChartCard({

            title: "Alertas Mensuales",

            subtitle: "Comparativo durante el año",

            content: mensualChart

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

            rows: ultimasAlertas.map(alerta => {

                const estudiante = usuariosPorId[alerta.estudianteId];

                return [

                    estudiante
                        ? `${estudiante.nombre} ${estudiante.apellido}`
                        : "Estudiante no disponible",

                    institucionesPorId[alerta.institucionId]?.nombre ?? "—",

                    NIVEL_ICONO[alerta.nivelRiesgo] ?? alerta.nivelRiesgo,

                    ESTADO_LABEL[alerta.estado] ?? alerta.estado

                ];

            }),

            emptyMessage: "Aún no hay alertas registradas."

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

            color: "blue",

            onClick() {

                navigate("/admin/usuarios");

            }

        }),

        QuickActionCard({

            title: "Asignar Roles",

            description: "Definir si el usuario será profesor o psicólogo.",

            icon: "user-shield",

            color: "yellow",

            onClick() {

                navigate("/admin/usuarios");

            }

        }),

        QuickActionCard({

            title: "Registrar Institución",

            description: "Agregar una nueva institución educativa.",

            icon: "school",

            color: "green",

            onClick() {

                navigate("/admin/instituciones");

            }

        }),

        QuickActionCard({

            title: "Generar Reporte",

            description: "Consultar indicadores y estadísticas.",

            icon: "chart-column",

            color: "red",

            onClick() {

                navigate("/admin/reportes");

            }

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

                "Fecha",

                "Actividad",

                "Usuario"

            ],

            rows: actividadReciente.map(evento => [

                evento.fecha,

                evento.actividad,

                evento.usuario

            ]),

            emptyMessage: "Aún no hay actividad registrada."

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

                    "API / Backend",

                    backendDisponible
                        ? "<i class=\"fa-solid fa-circle text-emerald-500\"></i> Operativa"
                        : "<i class=\"fa-solid fa-circle text-red-500\"></i> Sin conexión"

                ],

                [

                    "Base de datos",

                    backendDisponible
                        ? "<i class=\"fa-solid fa-circle text-emerald-500\"></i> Conectada"
                        : "<i class=\"fa-solid fa-circle text-red-500\"></i> Sin conexión"

                ],

                [

                    "Usuarios activos",

                    String(usuariosActivos.length)

                ],

                [

                    "Instituciones registradas",

                    String(instituciones.length)

                ],

                [

                    "Última sincronización",

                    "Justo ahora"

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
