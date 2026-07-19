// ======================================================
// modal.js
// Barranquilla Convive
// Helper global para abrir/cerrar el overlay de Modal.js
// ======================================================

let currentOverlay = null;

/**
 * Monta un elemento de Modal (overlay) en el body.
 * Si ya hay uno abierto, lo reemplaza.
 */
export function openModal(modalElement) {

    closeModal();

    document.body.appendChild(modalElement);

    document.body.classList.add("overflow-hidden");

    currentOverlay = modalElement;

}

/**
 * Cierra y remueve el modal actual del DOM.
 */
export function closeModal() {

    if (currentOverlay) {

        currentOverlay.remove();

        currentOverlay = null;

    }

    document.body.classList.remove("overflow-hidden");

}
