// ======================================================
// Button.js
// Barranquilla Convive
// ======================================================

export function Button({

    text = "Botón",

    icon = "",

    variant = "primary",

    size = "md",

    type = "button",

    disabled = false,

    fullWidth = false,

    onClick = null

} = {}) {

    const variants = {

        primary: `
            bg-yellow-400
            text-navy-900
            hover:bg-yellow-300
        `,

        secondary: `
            bg-white
            border
            border-slate-200
            text-slate-700
            hover:bg-slate-100
        `,

        success: `
            bg-emerald-600
            text-white
            hover:bg-emerald-700
        `,

        danger: `
            bg-red-600
            text-white
            hover:bg-red-700
        `,

        info: `
            bg-blue-600
            text-white
            hover:bg-blue-700
        `,

        ghost: `
            bg-transparent
            text-slate-600
            hover:bg-slate-100
        `

    };

    const sizes = {

        sm: `
            px-3
            py-2
            text-sm
        `,

        md: `
            px-5
            py-3
            text-sm
        `,

        lg: `
            px-7
            py-4
            text-base
        `

    };

    const button = document.createElement("button");

    button.type = type;

    button.disabled = disabled;

    button.className = `
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition-all
        duration-200
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${variants[variant]}

        ${sizes[size]}

        ${fullWidth ? "w-full" : ""}
    `;

    if (icon) {

        button.innerHTML = `
            <i class="fa-solid fa-${icon}"></i>
            <span>${text}</span>
        `;

    } else {

        button.textContent = text;

    }

    if (onClick) {

        button.addEventListener(

            "click",

            onClick

        );

    }

    return button;

}