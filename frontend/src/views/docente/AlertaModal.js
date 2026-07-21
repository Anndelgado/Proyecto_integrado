
import { Modal } from "../../components/ui/Modal.js";
import { AlertaForm } from "../../components/form/AlertaForm.js";
import { openModal, closeModal } from "../../utils/modal.js";
export function openAlertaModal({

    estudiantes = [],

    onSave = null

} = {}) {

    const form = AlertaForm({

        estudiantes,

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

            title: "Nueva Alerta",

            size: "lg",

            content: form,

            onClose: closeModal

        })

    );

}
