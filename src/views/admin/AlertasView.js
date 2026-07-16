// ======================================================
// AlertasView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { AlertaTable } from "./AlertaTable.js";
import { openAlertaDetailModal } from "./AlertaDetailModal.js";

import { getAlertas, updateAlertaEstado } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import { getInstituciones } from "../../services/InstitucionService.js";

export async function AlertasView() {

    const [alertas, estudiantes, instituciones] = await Promise.all([

        getAlertas().catch(() => []),

        getUsers().catch(() => []),

        getInstituciones().catch(() => [])

    ]);

    const estudiantesPorId = estudiantes.reduce((acc, estudiante) => {

        acc[estudiante.id] = estudiante;

        return acc;

    }, {});

    const institucionesPorId = instituciones.reduce((acc, institucion) => {

        acc[institucion.id] = institucion;

        return acc;

    }, {});

    const state = {

        search: "",

        nivel: "",

        estado: ""

    };

    //==================================================
    // Estadísticas
    //==================================================

    const altas = alertas.filter(a => a.nivelRiesgo === "alto").length;

    const pendientes = alertas.filter(a => a.estado === "pendiente").length;

    const resueltas = alertas.filter(a => a.estado === "resuelto").length;

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

            title: "Alertas Tempranas",

            subtitle: "Supervisa las alertas registradas por docentes y orientadores en toda la red distrital.",

            icon: "triangle-exclamation"

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

            title: "Total de Alertas",

            value: String(alertas.length),

            icon: "bell",

            color: "navy"

        }),

        StatCard({

            title: "Riesgo Alto",

            value: String(altas),

            icon: "triangle-exclamation",

            color: "red"

        }),

        StatCard({

            title: "Pendientes",

            value: String(pendientes),

            icon: "hourglass-half",

            color: "yellow"

        }),

        StatCard({

            title: "Resueltas",

            value: String(resueltas),

            icon: "circle-check",

            color: "green"

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Filtros
    //==================================================

    const filters = document.createElement("div");

    filters.className = `
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
    `;

    filters.innerHTML = `

        <div class="relative w-full lg:w-96">

            <i
                class="
                    fa-solid
                    fa-magnifying-glass
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                "
            ></i>

            <input

                id="alertas-search"

                type="text"

                placeholder="Buscar por estudiante o institución..."

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    focus:border-yellow-400
                "

            >

        </div>

        <div class="flex gap-3">

            <select
                id="alertas-nivel"
                class="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                "
            >

                <option value="">Todos los niveles</option>

                <option value="alto">Alto</option>

                <option value="medio">Medio</option>

                <option value="bajo">Bajo</option>

            </select>

            <select
                id="alertas-estado"
                class="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                "
            >

                <option value="">Todos los estados</option>

                <option value="pendiente">Pendiente</option>

                <option value="en seguimiento">En seguimiento</option>

                <option value="resuelto">Resuelto</option>

            </select>

        </div>

    `;

    filters.querySelector("#alertas-search").addEventListener(

        "input",

        (event) => {

            state.search = event.target.value.trim().toLowerCase();

            renderTable();

        }

    );

    filters.querySelector("#alertas-nivel").addEventListener(

        "change",

        (event) => {

            state.nivel = event.target.value;

            renderTable();

        }

    );

    filters.querySelector("#alertas-estado").addEventListener(

        "change",

        (event) => {

            state.estado = event.target.value;

            renderTable();

        }

    );

    page.appendChild(filters);

    //==================================================
    // Tabla
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function getFilteredAlertas() {

        return alertas.filter(alerta => {

            const estudiante = estudiantesPorId[alerta.estudianteId];

            const institucion = institucionesPorId[alerta.institucionId];

            const matchesSearch =
                !state.search ||
                estudiante?.nombre?.toLowerCase().includes(state.search) ||
                estudiante?.apellido?.toLowerCase().includes(state.search) ||
                institucion?.nombre?.toLowerCase().includes(state.search);

            const matchesNivel =
                !state.nivel ||
                alerta.nivelRiesgo === state.nivel;

            const matchesEstado =
                !state.estado ||
                alerta.estado === state.estado;

            return matchesSearch && matchesNivel && matchesEstado;

        });

    }

    async function resolveAlerta(id) {

        await updateAlertaEstado(id, "resuelto");

        location.reload();

    }

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            AlertaTable({

                alertas: getFilteredAlertas(),

                estudiantesPorId,

                institucionesPorId,

                onResolve(id) {

                    resolveAlerta(id);

                },

                onSeguimiento(alerta) {

                    openAlertaDetailModal({

                        alerta,

                        estudiante: estudiantesPorId[alerta.estudianteId],

                        institucion: institucionesPorId[alerta.institucionId]

                    });

                }

            })

        );

    }

    renderTable();

    //==================================================

    return DashboardLayout({

        activePath: "/admin/alertas",

        title: "Alertas Tempranas",

        content: page

    });

}
