
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

            onClose: closeModal

        })

    );

}