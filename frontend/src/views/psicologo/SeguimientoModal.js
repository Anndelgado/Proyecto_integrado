

import { Modal } from "../../components/ui/Modal.js";
import { Button } from "../../components/ui/Button.js";
import { openModal, closeModal } from "../../utils/modal.js";

/**
 * 
 * @param {Object} options
 * @param {number|string} [options.alertaId] 
 * @param {Array}  [options.casos]
 * @param {Function} options.onSave 
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
