// ======================================================
// UserModal.js
// Barranquilla Convive
// ======================================================

import { Modal } from "../../components/ui/Modal.js";
import { UserForm } from "../../components/form/UserForm.js";
import { openModal, closeModal } from "../../utils/modal.js";

export function openUserModal({

    user = null,

    onSave = null

} = {}) {

    const form = UserForm({

        user,

        onCancel() {

            closeModal();

        },

        onSubmit(data) {

            if (onSave) {

                onSave(data);

            }

            closeModal();

        }

    });

    openModal(

        Modal({

            title: user
                ? "Editar Usuario"
                : "Nuevo Usuario",

            size: "lg",

            content: form,

            // Sin esto, cerrar con la "X" o el fondo dejaba
            // "overflow-hidden" pegado en el <body> para siempre,
            // rompiendo el scroll en todo el sitio.
            onClose: closeModal

        })

    );

}