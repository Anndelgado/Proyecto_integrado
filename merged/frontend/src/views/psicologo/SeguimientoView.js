// ======================================================
// SeguimientoView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { openSeguimientoModal } from "./SeguimientoModal.js";

import { getSession } from "../../session.js";
import { getAlertas, updateAlertaEstado } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import {
    getSeguimientos,
    createSeguimiento
} from "../../services/SeguimientoService.js";
import { navigate } from "../../router.js";

export async function SeguimientoView() {

    const session = getSession() || {};

    const [seguimientosTodos, alertasTodas, usuarios] = await Promise.all([

        getSeguimientos().catch(() => []),

        getAlertas().catch(() => []),

        getUsers().catch(() => [])

    ]);

    const casos = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const casosPorId = casos.reduce((acc, caso) => {

        acc[caso.id] = caso;

        return acc;

    }, {});

    const usuariosPorId = usuarios.reduce((acc, usuario) => {

        acc[usuario.id] = usuario;

        return acc;

    }, {});

    // Solo los seguimientos que pertenecen a un caso de esta institución.
    const seguimientos = seguimientosTodos.filter(

        seguimiento => casosPorId[seguimiento.alertaId]

    );

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

            title: "Seguimiento",

            subtitle: "Historial de observaciones y avances registrados sobre los casos a tu cargo.",

            icon: "notes-medical",

            buttonText: "Nuevo Seguimiento",

            buttonIcon: "circle-plus",

            onButtonClick() {

                nuevoSeguimiento();

            },

            stats: [

                { label: "Seguimientos registrados", value: seguimientos.length },

                { label: "Casos en seguimiento", value: casos.filter(c => c.estado === "en seguimiento").length },

                { label: "Casos pendientes", value: casos.filter(c => c.estado === "pendiente").length }

            ]

        })

    );

    //==================================================
    // Tabla
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function nombreEstudiante(alertaId) {

        const caso = casosPorId[alertaId];

        const estudiante = caso ? usuariosPorId[caso.estudianteId] : null;

        return estudiante
            ? `${estudiante.nombre} ${estudiante.apellido}`
            : "Estudiante no disponible";

    }

    function verCasoBoton(alertaId) {

        const button = document.createElement("button");

        button.type = "button";

        button.className = `
            rounded-lg
            px-3
            py-2
            text-xs
            font-semibold
            text-yellow-600
            transition
            hover:bg-yellow-50
        `;

        button.innerHTML = `Ver caso <i class="fa-solid fa-arrow-right ml-1"></i>`;

        button.addEventListener("click", () => {

            navigate(`/psicologo/casos/${alertaId}`);

        });

        return button;

    }

    function renderTable() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            TableCard({

                title: "Historial de Seguimiento",

                subtitle: `${seguimientos.length} seguimientos registrados`,

                headers: [

                    "Fecha",

                    "Estudiante",

                    "Caso",

                    "Comentario",

                    ""

                ],

                rows: seguimientos.map(seguimiento => [

                    seguimiento.fecha,

                    nombreEstudiante(seguimiento.alertaId),

                    `#${seguimiento.alertaId}`,

                    seguimiento.comentario,

                    verCasoBoton(seguimiento.alertaId)

                ]),

                emptyMessage: "Aún no se han registrado seguimientos."

            })

        );

    }

    renderTable();

    //==================================================
    // Nuevo seguimiento
    //==================================================

    function nuevoSeguimiento() {

        if (!casos.length) {

            alert("No tienes casos asignados para registrar un seguimiento.");

            return;

        }

        openSeguimientoModal({

            casos: casos.map(caso => ({

                id: caso.id,

                estudianteNombre: nombreEstudiante(caso.id)

            })),

            async onSave({ alertaId, comentario }) {

                await createSeguimiento({

                    alertaId,

                    usuarioId: session.id,

                    comentario,

                    fecha: new Date().toISOString().slice(0, 10)

                });

                const caso = casosPorId[alertaId];

                if (caso && caso.estado === "pendiente") {

                    await updateAlertaEstado(alertaId, "en seguimiento");

                }

                location.reload();

            }

        });

    }

    //==================================================

    return DashboardLayout({

        activePath: "/psicologo/seguimiento",

        title: "Seguimiento",

        content: page

    });

}
