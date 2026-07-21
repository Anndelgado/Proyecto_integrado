let currentOverlay = null;
export function openModal(modalElement) {

    closeModal();

    document.body.appendChild(modalElement);

    document.body.classList.add("overflow-hidden");

    currentOverlay = modalElement;

}
export function closeModal() {

    if (currentOverlay) {

        currentOverlay.remove();

        currentOverlay = null;

    }

    document.body.classList.remove("overflow-hidden");

}
