import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Badge } from "../../components/ui/Badge.js";
import { getSession } from "../../session.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import { getCursos } from "../../services/CursoService.js";
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

export async function CasosView() {

    const session = getSession() || {};

    const [alertasTodas, usuarios, cursos, instituciones] = await Promise.all([

        getAlertas().catch(() => []),

        getUsers().catch(() => []),

        getCursos().catch(() => []),

        getInstituciones().catch(() => [])

    ]);
    const casos = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const usuariosPorId = usuarios.reduce((acc, usuario) => {

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

    const state = {

        nivel: "",

        estado: ""

    };
    const altoRiesgo = casos.filter(c => c.nivelRiesgo === "alto").length;
    const pendientes = casos.filter(c => c.estado === "pendiente").length;
    const resueltos = casos.filter(c => c.estado === "resuelto").length;
    const page = document.createElement("div");
    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Mis Casos",

            subtitle: "Consulta y filtra todos los casos asignados según su nivel de riesgo y estado de atención.",

            icon: "folder-open",

            stats: [

                { label: "Total de casos", value: casos.length },

                { label: "Riesgo alto", value: altoRiesgo },

                { label: "Pendientes", value: pendientes },

                { label: "Resueltos", value: resueltos }

            ]

        })

    );
    const filters = document.createElement("div");
    filters.className = `
        flex
        flex-wrap
        justify-end
        gap-3
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
    function getFilteredCasos() {
        return casos.filter(caso => {
            const matchesNivel =
                !state.nivel ||
                caso.nivelRiesgo === state.nivel;
            const matchesEstado =
                !state.estado ||
                caso.estado === state.estado;
            return matchesNivel && matchesEstado;
        });
    }
    function verBoton(casoId) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `
            rounded-lg
            bg-yellow-400
            px-3
            py-2
            text-xs
            font-semibold
            text-navy-900
            transition
            hover:bg-yellow-300
        `;
        button.innerHTML = `Ver caso <i class="fa-solid fa-arrow-right ml-1"></i>`;
        button.addEventListener("click", () => {
            navigate(`/psicologo/casos/${casoId}`);
        });
        return button;
    }

    function renderTable() {

        const filtrados = getFilteredCasos();

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            TableCard({

                title: "Casos asignados",

                subtitle: `${filtrados.length} de ${casos.length} casos`,

                headers: [

                    "Estudiante",

                    "Institución",

                    "Curso",

                    "Nivel",

                    "Estado",

                    "Fecha",

                    ""

                ],

                rows: filtrados.map(caso => {

                    const estudiante = usuariosPorId[caso.estudianteId];

                    return [

                        estudiante
                            ? `${estudiante.nombre} ${estudiante.apellido}`
                            : "Estudiante no disponible",

                        institucionesPorId[caso.institucionId]?.nombre ?? "—",

                        cursosPorId[caso.cursoId]?.nombre ?? "—",

                        Badge({

                            text: NIVEL_LABEL[caso.nivelRiesgo] ?? caso.nivelRiesgo,

                            variant: NIVEL_VARIANT[caso.nivelRiesgo] ?? "neutral"

                        }),

                        ESTADO_LABEL[caso.estado] ?? caso.estado,

                        caso.fecha,

                        verBoton(caso.id)

                    ];

                }),

                emptyMessage: "No hay casos que coincidan con los filtros seleccionados."

            })

        );

    }

    renderTable();

    return DashboardLayout({

        activePath: "/psicologo/casos",

        title: "Mis Casos",

        content: page

    });

}
