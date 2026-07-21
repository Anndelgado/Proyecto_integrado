import { TableCard } from "../../components/dashboard/TableCard.js";
export function AlertaTable({

    alertas = [],

    estudiantesPorId = {},

    institucionesPorId = {},

    onResolve = () => {},

    onSeguimiento = () => {}

} = {}) {

    const table = TableCard({

        title: "Alertas registradas",

        subtitle: `${alertas.length} alertas encontradas`,

        headers: [

            "Estudiante",

            "Institución",

            "Nivel",

            "Fecha",

            "Estado",

            "Acciones"
        ],

        rows: alertas.map(alerta => {

            const estudiante = estudiantesPorId[alerta.estudianteId];

            const institucion = institucionesPorId[alerta.institucionId];

            return [

                `
                <div>

                    <p class="font-semibold text-navy-900">

                        ${estudiante
                            ? `${estudiante.nombre} ${estudiante.apellido}`
                            : "Estudiante no disponible"}

                    </p>

                    <p class="mt-1 text-xs text-slate-400">

                        ${alerta.descripcion ?? ""}

                    </p>

                </div>
                `,

                institucion?.nombre ?? "—",

                nivelBadge(alerta.nivelRiesgo),

                alerta.fecha,

                estadoBadge(alerta.estado),

                actions(alerta)

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

            const resolveBtn = event.target.closest(".resolve-alerta");

            if (resolveBtn) {

                onResolve(resolveBtn.dataset.id);

                return;

            }

            const seguimientoBtn = event.target.closest(".seguimiento-alerta");

            if (seguimientoBtn) {

                onSeguimiento(findAlerta(seguimientoBtn.dataset.id));

                return;

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

function actions(alerta) {

    return `

        <div class="flex gap-2">

            <button

                class="
                    seguimiento-alerta
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

            ${alerta.estado !== "resuelto" ? `
            <button

                class="
                    resolve-alerta
                    rounded-lg
                    bg-green-600
                    px-3
                    py-2
                    text-white
                "

                data-id="${alerta.id}"

                title="Marcar como resuelta"

            >

                <i class="fa-solid fa-check"></i>

            </button>
            ` : ""}

        </div>

    `;

}
