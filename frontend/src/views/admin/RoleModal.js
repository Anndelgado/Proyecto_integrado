

import { Modal } from "../../components/ui/Modal.js";
import { openModal, closeModal } from "../../utils/modal.js";

export function openRoleModal({

    user,

    onSave = null

} = {}) {

    const form = document.createElement("form");

    form.className = "space-y-6";

    form.innerHTML = `

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
                Usuario
            </label>

            <input

                disabled

                value="${user.nombre}"

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    py-3
                "

            >

        </div>

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
                Rol
            </label>

            <select

                name="rol"

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

                <option value="admin" ${user.rol === "admin" ? "selected" : ""}>
                    Administrador
                </option>

                <option value="docente" ${user.rol === "docente" ? "selected" : ""}>
                    Docente
                </option>

                <option value="psicologo" ${user.rol === "psicologo" ? "selected" : ""}>
                    Psicólogo
                </option>

                <option value="estudiante" ${user.rol === "estudiante" ? "selected" : ""}>
                    Estudiante
                </option>

            </select>

        </div>

    `;

   

    const footer = document.createElement("div");

    footer.className = `
        mt-8
        flex
        justify-end
        gap-3
    `;

    const cancel = document.createElement("button");

    cancel.type = "button";

    cancel.className = `
        rounded-xl
        border
        border-slate-200
        px-5
        py-3
        hover:bg-slate-100
    `;

    cancel.textContent = "Cancelar";

    cancel.onclick = closeModal;

    
    const save = document.createElement("button");

    save.type = "submit";

    save.className = `
        rounded-xl
        bg-yellow-400
        px-5
        py-3
        font-semibold
        text-navy-900
        hover:bg-yellow-300
    `;

    save.innerHTML = `

        <i class="fa-solid fa-floppy-disk mr-2"></i>

        Guardar

    `;

    footer.append(

        cancel,

        save

    );

    form.appendChild(footer);

    

    form.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            const rol = form.rol.value;

            if (onSave) {

                onSave(rol);

            }

            closeModal();

        }

    );

    openModal(

        Modal({

            title: "Cambiar Rol",

            size: "md",

            content: form,

            
            onClose: closeModal

        })

    );

}