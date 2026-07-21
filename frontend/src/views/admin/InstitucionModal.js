import { Modal } from "../../components/ui/Modal.js";
import { InstitucionForm } from "../../components/form/InstitucionForm.js";
import { openModal, closeModal } from "../../utils/modal.js";
export function openInstitucionModal({

    institucion = null,

    onSave = null

} = {}) {

    const form = InstitucionForm({

        institucion,

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

            title: institucion
                ? "Editar Institución"
                : "Nueva Institución",

            size: "lg",

            content: form,

            onClose: closeModal

        })

    );

}
