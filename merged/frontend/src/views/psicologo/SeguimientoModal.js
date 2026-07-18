// ======================================================
// SeguimientoModal.js
// Barranquilla Convive
// ======================================================

import { Modal } from "../../components/ui/Modal.js";
import { Button } from "../../components/ui/Button.js";
import { openModal, closeModal } from "../../utils/modal.js";

/**
 * Modal para registrar un nuevo seguimiento.
 *
 * @param {Object} options
 * @param {number|string} [options.alertaId] - Caso fijo (viene desde el
 *   detalle de un caso). Si no se envía, se debe enviar `casos` para que
 *   el psicólogo elija a cuál caso pertenece el seguimiento.
 * @param {Array}  [options.casos] - Lista de casos disponibles
 *   ({ id, estudianteNombre }) para el selector.
 * @param {Function} options.onSave - Recibe { alertaId, comentario }.
 */
export function openSeguimientoModal({

    alertaId = null,

    casos = [],

    onSave = () => {}

} = {}) {

    const content = document.createElement("form");

    content.className = `
        flex
        flex-col
        gap-6
    `;

    content.innerHTML = `

        ${
            alertaId
                ? ""
                : `
                    <div>

                        <label
                            class="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                            "
                        >
                            Caso

                        </label>

                        <select
                            name="alertaId"
                            required
                            class="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                outline-none
                                focus:border-yellow-400
                            "
                        >

                            <option value="">Selecciona un caso</option>

                            ${casos.map(caso => `
                                <option value="${caso.id}">
                                    #${caso.id} · ${caso.estudianteNombre}
                                </option>
                            `).join("")}

                        </select>

                    </div>
                `
        }

        <div>

            <label
                class="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                "
            >
                Observación / Comentario

            </label>

            <textarea
                name="comentario"
                required
                rows="5"
                placeholder="Describe la observación, avance o acción realizada con el estudiante..."
                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-yellow-400
                "
            ></textarea>

        </div>

        <div
            class="
                flex
                justify-end
                gap-3
                border-t
                border-slate-200
                pt-4
            "
        >

        </div>

    `;

    const cancelButton = Button({

        text: "Cancelar",

        variant: "secondary",

        onClick: closeModal

    });

    const saveButton = Button({

        text: "Guardar seguimiento",

        icon: "floppy-disk",

        type: "submit"

    });

    content.lastElementChild.append(

        cancelButton,

        saveButton

    );

    content.addEventListener(

        "submit",

        async (event) => {

            event.preventDefault();

            const data = Object.fromEntries(new FormData(content).entries());

            saveButton.disabled = true;

            try {

                await onSave({

                    alertaId: Number(alertaId ?? data.alertaId),

                    comentario: data.comentario

                });

                closeModal();

            } catch (error) {

                alert(error.message ?? "No se pudo registrar el seguimiento.");

                saveButton.disabled = false;

            }

        }

    );

    openModal(

        Modal({

            title: "Registrar Seguimiento",

            content,

            onClose: closeModal

        })

    );

}
