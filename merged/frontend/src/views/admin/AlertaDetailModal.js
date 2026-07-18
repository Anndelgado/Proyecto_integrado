// ======================================================
// AlertaDetailModal.js
// Barranquilla Convive
// ======================================================

import { Modal } from "../../components/ui/Modal.js";
import { openModal, closeModal } from "../../utils/modal.js";
import { getSeguimientosByAlerta } from "../../services/SeguimientoService.js";

export async function openAlertaDetailModal({

    alerta,

    estudiante = null,

    institucion = null

} = {}) {

    const seguimientos = await getSeguimientosByAlerta(alerta.id).catch(() => []);

    const content = document.createElement("div");

    content.className = `
        flex
        flex-col
        gap-6
    `;

    content.innerHTML = `

        <div
            class="
                rounded-2xl
                bg-slate-50
                p-5
            "
        >

            <p class="text-sm text-slate-500">

                Estudiante

            </p>

            <p class="mt-1 text-lg font-semibold text-navy-900">

                ${estudiante
                    ? `${estudiante.nombre} ${estudiante.apellido}`
                    : "Estudiante no disponible"}

            </p>

            <p class="mt-3 text-sm text-slate-500">

                Institución

            </p>

            <p class="mt-1 font-medium text-navy-900">

                ${institucion?.nombre ?? "—"}

            </p>

            <p class="mt-3 text-sm text-slate-500">

                Descripción

            </p>

            <p class="mt-1 text-sm leading-6 text-slate-700">

                ${alerta.descripcion ?? "Sin descripción."}

            </p>

        </div>

        <div>

            <h3 class="mb-4 text-lg font-semibold text-navy-900">

                Historial de seguimiento

            </h3>

            ${seguimientos.length
                ? `
                    <ul class="flex flex-col gap-4">

                        ${seguimientos.map(seguimiento => `

                            <li
                                class="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    p-4
                                "
                            >

                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">

                                    ${seguimiento.fecha}

                                </p>

                                <p class="mt-2 text-sm leading-6 text-slate-700">

                                    ${seguimiento.comentario}

                                </p>

                            </li>

                        `).join("")}

                    </ul>
                `
                : `
                    <p class="text-sm text-slate-400">

                        Aún no se han registrado seguimientos para esta alerta.

                    </p>
                `
            }

        </div>

    `;

    openModal(

        Modal({

            title: "Detalle de la Alerta",

            size: "lg",

            content,

            onClose: closeModal

        })

    );

}
