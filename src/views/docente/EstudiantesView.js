// ======================================================
// EstudiantesView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StudentTable } from "./StudentTable.js";
import { openAlertaModal } from "./AlertaModal.js";

import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";
import { getCursos } from "../../services/CursoService.js";
import { createAlerta } from "../../services/AlertaService.js";

export async function EstudiantesView() {

    const session = getSession() || {};

    const [usuarios, cursos] = await Promise.all([

        getUsers().catch(() => []),

        getCursos().catch(() => [])

    ]);

    const cursosDeInstitucion = cursos.filter(

        curso => curso.institucionId === session.institucionId

    );

    const cursosPorId = cursos.reduce((acc, curso) => {

        acc[curso.id] = curso;

        return acc;

    }, {});

    const estudiantes = usuarios.filter(

        usuario =>
            usuario.rol === "estudiante" &&
            usuario.institucionId === session.institucionId

    );

    const state = {

        search: "",

        curso: ""

    };

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

            title: "Mis Estudiantes",

            subtitle: "Consulta la información de tus estudiantes y reporta alertas cuando lo consideres necesario.",

            icon: "user-graduate",

            buttonText: "Nueva Alerta",

            buttonIcon: "circle-exclamation",

            onButtonClick() {

                openAlertaModal({

                    estudiantes,

                    async onSave(data) {

                        await createAlerta({

                            ...data,

                            estudianteId: Number(data.estudianteId),

                            institucionId: session.institucionId,

                            cursoId: estudiantes.find(
                                e => e.id === Number(data.estudianteId)
                            )?.cursoId ?? null,

                            estado: "pendiente",

                            fecha: new Date().toISOString().slice(0, 10)

                        });

                        location.reload();

                    }

                });

            },

            stats: [

                { label: "Total de estudiantes", value: estudiantes.length },

                { label: "Cursos a cargo", value: cursosDeInstitucion.length }

            ]

        })

    );

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

                id="estudiantes-search"

                type="text"

                placeholder="Buscar estudiante..."

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

        <select
            id="estudiantes-curso"
            class="
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
            "
        >

            <option value="">Todos los cursos</option>

            ${cursosDeInstitucion.map(curso => `
                <option value="${curso.id}">${curso.nombre}</option>
            `).join("")}

        </select>

    `;

    filters.querySelector("#estudiantes-search").addEventListener(

        "input",

        (event) => {

            state.search = event.target.value.trim().toLowerCase();

            renderTable();

        }

    );

    filters.querySelector("#estudiantes-curso").addEventListener(

        "change",

        (event) => {

            state.curso = event.target.value;

            renderTable();

        }

    );

    page.appendChild(filters);

    //==================================================
    // Tabla
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function getFilteredEstudiantes() {

        return estudiantes.filter(estudiante => {

            const matchesSearch =
                !state.search ||
                estudiante.nombre?.toLowerCase().includes(state.search) ||
                estudiante.apellido?.toLowerCase().includes(state.search) ||
                estudiante.documento?.toLowerCase().includes(state.search);

            const matchesCurso =
                !state.curso ||
                String(estudiante.cursoId) === state.curso;

            return matchesSearch && matchesCurso;

        });

    }

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            StudentTable({

                estudiantes: getFilteredEstudiantes(),

                cursosPorId,

                onReportarAlerta(estudiante) {

                    openAlertaModal({

                        estudiantes: [estudiante],

                        async onSave(data) {

                            await createAlerta({

                                ...data,

                                estudianteId: Number(data.estudianteId),

                                institucionId: session.institucionId,

                                cursoId: estudiante.cursoId ?? null,

                                estado: "pendiente",

                                fecha: new Date().toISOString().slice(0, 10)

                            });

                            location.reload();

                        }

                    });

                }

            })

        );

    }

    renderTable();

    //==================================================

    return DashboardLayout({

        activePath: "/docente/estudiantes",

        title: "Mis Estudiantes",

        content: page

    });

}
