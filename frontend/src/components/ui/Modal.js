export function Modal({

    title = "Modal",

    content = null,

    size = "md",

    onClose = null

} = {}) {

    const sizes = {

        sm: "max-w-md",

        md: "max-w-2xl",

        lg: "max-w-4xl",

        xl: "max-w-6xl"

    };
    const overlay = document.createElement("div");

    overlay.className = `
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-6
    `;
    const modal = document.createElement("div");

    modal.className = `
        w-full
        ${sizes[size]}
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-2xl
        animate-fadeIn
    `;

    const header = document.createElement("div");

    header.className = `
        flex
        items-center
        justify-between
        border-b
        border-slate-200
        px-8
        py-6
    `;

    header.innerHTML = `

        <h2
            class="
                text-2xl
                font-bold
                text-navy-900
            "
        >
            ${title}
        </h2>

    `;

    const closeButton = document.createElement("button");

    closeButton.className = `
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        transition
        hover:bg-red-100
        hover:text-red-600
    `;

    closeButton.innerHTML = `
        <i class="fa-solid fa-xmark text-xl"></i>
    `;

    header.appendChild(closeButton);

    const body = document.createElement("div");

    body.className = `
        max-h-[70vh]
        overflow-y-auto
        p-8
    `;

    if (content instanceof HTMLElement) {

        body.appendChild(content);

    } else {

        body.innerHTML = content || "";

    }

    function closeModal() {

        overlay.remove();

        document.removeEventListener("keydown", onKeydown);

        if (onClose) {

            onClose();

        }

    }

    function onKeydown(e) {

        if (e.key === "Escape") {

            closeModal();

        }

    }

    document.addEventListener("keydown", onKeydown);

    closeButton.addEventListener(

        "click",

        closeModal

    );

    overlay.addEventListener(

        "click",

        (e) => {

            if (e.target === overlay) {

                closeModal();

            }

        }

    );

    modal.append(

        header,

        body

    );

    overlay.appendChild(modal);

    return overlay;

}