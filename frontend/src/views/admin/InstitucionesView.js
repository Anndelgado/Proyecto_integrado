import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { InstitucionTable } from "./InstitucionTable.js";
import { InstitucionController } from "../../controllers/InstitucionController.js";
import { getCursos } from "../../services/CursoService.js";
export async function InstitucionesView() {

    const controller = new InstitucionController();

    const [instituciones, cursos] = await Promise.all([

        controller.loadInstituciones(),

        getCursos().catch(() => [])

    ]);

    const state = {

        search: ""

    };
    const cursosPorInstitucion = cursos.reduce((acc, curso) => {

        acc[curso.institucionId] = (acc[curso.institucionId] ?? 0) + 1;

        return acc;

    }, {});
    const localidades = new Set(

        instituciones.map(institucion => institucion.localidad)

    ).size;

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Instituciones Educativas",

            subtitle: "Administra las instituciones vinculadas al sistema distrital de alertas tempranas.",

            icon: "school",

            buttonText: "Nueva Institución",

            buttonIcon: "circle-plus",

            onButtonClick() {

                controller.create();

            },

            stats: [

                { label: "Total de instituciones", value: instituciones.length },

                { label: "Cursos registrados", value: cursos.length },

                { label: "Localidades", value: localidades },

                { label: "Estudiantes vinculados", value: "—" }

            ]

        })

    );

    const actions = document.createElement("section");

    actions.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    actions.append(

        QuickActionCard({

            title: "Registrar Institución",

            description: "Agregar una nueva institución educativa al sistema.",

            icon: "school",

            color: "blue",

            onClick() {

                controller.create();

            }

        }),

        QuickActionCard({

            title: "Gestionar Cursos",

            description: "Los cursos se administran junto a cada institución.",

            icon: "chalkboard-user",

            color: "yellow"

        }),

        QuickActionCard({

            title: "Exportar Listado",

            description: "Exportar el listado de instituciones visibles.",

            icon: "file-export",

            color: "green",

            onClick() {

                exportInstitucionesToCSV(getFilteredInstituciones());

            }

        })

    );

    page.appendChild(actions);
    const searchWrapper = document.createElement("div");
    searchWrapper.className = `
        flex
        justify-end
    `;
    searchWrapper.innerHTML = `
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
                type="text"

                placeholder="Buscar institución..."

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
    `;

    searchWrapper.querySelector("input").addEventListener(

        "input",

        (event) => {

            state.search = event.target.value.trim().toLowerCase();

            renderTable();

        }

    );

    page.appendChild(searchWrapper);
    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function getFilteredInstituciones() {

        return instituciones.filter(institucion => {

            return (

                !state.search ||
                institucion.nombre?.toLowerCase().includes(state.search) ||
                institucion.codigo?.toLowerCase().includes(state.search) ||
                institucion.localidad?.toLowerCase().includes(state.search)

            );

        });

    }

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            InstitucionTable({

                instituciones: getFilteredInstituciones(),

                cursosPorInstitucion,

                onEdit(institucion) {

                    controller.edit(institucion);

                },

                onDelete(id) {

                    controller.remove(id);

                }

            })

        );

    }

    renderTable();
    return DashboardLayout({

        activePath: "/admin/instituciones",

        title: "Instituciones Educativas",

        content: page

    });

}
function exportInstitucionesToCSV(instituciones) {

    if (!instituciones.length) {

        alert("No hay instituciones para exportar con los filtros actuales.");

        return;

    }

    const headers = [
        "Código",
        "Nombre",
        "Dirección",
        "Localidad",
        "Teléfono"
    ];

    const rows = instituciones.map(institucion => [

        institucion.codigo,

        institucion.nombre,

        institucion.direccion,

        institucion.localidad,

        institucion.telefono

    ]);

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

    link.download = "instituciones-barranquilla-convive.csv";

    link.click();

    URL.revokeObjectURL(url);

}
