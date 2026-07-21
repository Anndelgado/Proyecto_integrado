import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { DocenteAlertaTable } from "./DocenteAlertaTable.js";
import { openAlertaModal } from "./AlertaModal.js";
import { openAlertaDetailModal } from "../admin/AlertaDetailModal.js";
import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";
import { getCursos } from "../../services/CursoService.js";
import { getInstituciones } from "../../services/InstitucionService.js";
import { getAlertas, createAlerta } from "../../services/AlertaService.js";
export async function AlertasView() {

    const session = getSession() || {};

    const [usuarios, cursos, instituciones, alertasTodas] = await Promise.all([

        getUsers().catch(() => []),

        getCursos().catch(() => []),

        getInstituciones().catch(() => []),

        getAlertas().catch(() => [])

    ]);

    const estudiantes = usuarios.filter(

        usuario =>
            usuario.rol === "estudiante" &&
            usuario.institucionId === session.institucionId

    );

    const estudiantesPorId = usuarios.reduce((acc, usuario) => {

        acc[usuario.id] = usuario;

        return acc;

    }, {});

    const cursosPorId = cursos.reduce((acc, curso) => {

        acc[curso.id] = curso;

        return acc;

    }, {});

    const institucionesPorId = instituciones.reduce((acc, institucion) => {

        acc[institucion.id] = institucion;

        return acc;

    }, {});

    const alertas = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const state = {

        nivel: "",

        estado: ""

    };
    const altas = alertas.filter(a => a.nivelRiesgo === "alto").length;

    const pendientes = alertas.filter(a => a.estado === "pendiente").length;

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Alertas Tempranas",

            subtitle: "Reporta y consulta las alertas de tus estudiantes. Serán revisadas por el equipo de orientación.",

            icon: "triangle-exclamation",

            buttonText: "Nueva Alerta",

            buttonIcon: "circle-exclamation",

            onButtonClick() {

                crearAlerta();

            },

            stats: [

                { label: "Total de alertas", value: alertas.length },

                { label: "Riesgo alto", value: altas },

                { label: "Pendientes", value: pendientes }

            ]

        })

    );
    const filters = document.createElement("div");
    filters.className = `
        flex
        gap-3
        justify-end
    `;

    filters.innerHTML = `

        <select
            id="nivel-filtro"
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
            id="estado-filtro"
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

    `;

    filters.querySelector("#nivel-filtro").addEventListener(

        "change",

        (event) => {

            state.nivel = event.target.value;

            renderTable();

        }

    );

    filters.querySelector("#estado-filtro").addEventListener(

        "change",

        (event) => {

            state.estado = event.target.value;

            renderTable();

        }

    );

    page.appendChild(filters);
    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function getFilteredAlertas() {

        return alertas.filter(alerta => {

            const matchesNivel =
                !state.nivel ||
                alerta.nivelRiesgo === state.nivel;

            const matchesEstado =
                !state.estado ||
                alerta.estado === state.estado;

            return matchesNivel && matchesEstado;

        });

    }

    function crearAlerta() {

        openAlertaModal({

            estudiantes,

            async onSave(data) {

                const estudianteSeleccionado = estudiantes.find(
                    e => e.id === Number(data.estudianteId)
                );

                await createAlerta({

                    ...data,

                    estudianteId: Number(data.estudianteId),

                    institucionId: session.institucionId,

                    cursoId: estudianteSeleccionado?.cursoId ?? null,

                    estado: "pendiente",

                    fecha: new Date().toISOString().slice(0, 10)

                });

                location.reload();

            }

        });

    }
    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            DocenteAlertaTable({

                alertas: getFilteredAlertas(),

                estudiantesPorId,

                cursosPorId,

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
    return DashboardLayout({

        activePath: "/docente/alertas",

        title: "Alertas Tempranas",

        content: page

    });

}
