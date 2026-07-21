
import { TableCard } from "../../components/dashboard/TableCard.js";

export function DocenteAlertaTable({

    alertas = [],

    estudiantesPorId = {},

    cursosPorId = {},

    onSeguimiento = () => {}

} = {}) {

    const table = TableCard({

        title: "Alertas de mis estudiantes",

        subtitle: `${alertas.length} alertas encontradas`,

        headers: [

            "Estudiante",

            "Curso",

            "Nivel",

            "Fecha",

            "Estado",

            "Acciones"

        ],

        rows: alertas.map(alerta => {

            const estudiante = estudiantesPorId[alerta.estudianteId];

            return [

                estudiante
                    ? `${estudiante.nombre} ${estudiante.apellido}`
                    : "Estudiante no disponible",

                cursosPorId[alerta.cursoId]?.nombre ?? "—",

                nivelBadge(alerta.nivelRiesgo),

                alerta.fecha,

                estadoBadge(alerta.estado),

                `
                <button

                    class="
                        ver-seguimiento
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-white
                    "

                    data-id="${alerta.id}"

                    title="Ver seguimiento"

                >

                    <i class="fa-solid fa-notes-medical"></i>

                </button>
                `

            ];

        })

    });

    function findAlerta(id) {

        return alertas.find(
            a => String(a.id) === String(id)
        );

    }

    table.addEventListener(

        "click",

        (event) => {

            const button = event.target.closest(".ver-seguimiento");

            if (button) {

                onSeguimiento(findAlerta(button.dataset.id));

            }

        }

    );

    return table;

}


function nivelBadge(nivel) {

    const config = {

        alto: { color: "bg-red-100 text-red-700", label: "<i class=\"fa-solid fa-circle text-red-500\"></i> Alto" },

        medio: { color: "bg-yellow-100 text-yellow-700", label: "<i class=\"fa-solid fa-circle text-yellow-500\"></i> Medio" },

        bajo: { color: "bg-emerald-100 text-emerald-700", label: "<i class=\"fa-solid fa-circle text-emerald-500\"></i> Bajo" }

    };

    const item = config[nivel] ?? { color: "bg-slate-100 text-slate-700", label: nivel };

    return `

        <span
            class="
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${item.color}
            "
        >

            ${item.label}

        </span>

    `;

}


function estadoBadge(estado) {

    const colors = {

        pendiente: "bg-yellow-100 text-yellow-700",

        "en seguimiento": "bg-blue-100 text-blue-700",

        resuelto: "bg-emerald-100 text-emerald-700"

    };

    return `

        <span
            class="
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                capitalize
                ${colors[estado] || "bg-slate-100 text-slate-700"}
            "
        >

            ${estado}

        </span>

    `;

}
