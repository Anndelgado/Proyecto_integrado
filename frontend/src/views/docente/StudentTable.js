import { TableCard } from "../../components/dashboard/TableCard.js";
export function StudentTable({

    estudiantes = [],

    cursosPorId = {},

    onReportarAlerta = () => {}

} = {}) {

    const table = TableCard({

        title: "Mis Estudiantes",

        subtitle: `${estudiantes.length} estudiantes encontrados`,

        headers: [

            "Nombre",

            "Documento",

            "Curso",

            "Correo",

            "Acciones"

        ],

        rows: estudiantes.map(estudiante => [

            `
            <p class="font-semibold text-navy-900">

                ${estudiante.nombre} ${estudiante.apellido}

            </p>
            `,

            estudiante.documento,

            cursosPorId[estudiante.cursoId]?.nombre ?? "—",

            estudiante.correo,

            actions(estudiante)

        ])

    });
    function findEstudiante(id) {

        return estudiantes.find(
            e => String(e.id) === String(id)
        );

    }

    table.addEventListener(

        "click",

        (event) => {

            const reportBtn = event.target.closest(".reportar-alerta");

            if (reportBtn) {

                onReportarAlerta(findEstudiante(reportBtn.dataset.id));

            }

        }

    );

    return table;

}
function actions(estudiante) {

    return `

        <button

            class="
                reportar-alerta
                rounded-lg
                bg-red-600
                px-3
                py-2
                text-white
            "

            data-id="${estudiante.id}"

            title="Reportar alerta"

        >

            <i class="fa-solid fa-circle-exclamation mr-1"></i>

            Reportar

        </button>

    `;

}
