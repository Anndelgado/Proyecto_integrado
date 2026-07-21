export function PageHeader({

    title = "Título",

    subtitle = "",

    icon = "folder",

    buttonText = "",

    buttonIcon = "plus",

    secondaryButtonText = "",

    secondaryButtonIcon = "arrow-rotate-right",

    onButtonClick = null,

    onSecondaryClick = null,

    stats = []

} = {}) {

    const header = document.createElement("section");

    header.className = `
        rounded-3xl
        bg-white
        p-8
        shadow-sm
    `;
    const top = document.createElement("div");

    top.className = `
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-center
        lg:justify-between
    `;
    const info = document.createElement("div");

    info.className = `
        flex
        items-start
        gap-5
    `;

    info.innerHTML = `

        <div
            class="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-yellow-100
                text-yellow-600
            "
        >

            <i
                class="
                    fa-solid
                    fa-${icon}
                    text-2xl
                "
            ></i>

        </div>

        <div>

            <h1
                class="
                    text-3xl
                    font-bold
                    text-navy-900
                "
            >

                ${title}

            </h1>

            <p
                class="
                    mt-2
                    max-w-3xl
                    text-slate-500
                "
            >

                ${subtitle}

            </p>

        </div>

    `;
    const actions = document.createElement("div");

    actions.className = `
        flex
        flex-wrap
        gap-3
    `;

    if (secondaryButtonText) {

        const secondary = document.createElement("button");

        secondary.type = "button";

        secondary.className = `
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            font-medium
            text-slate-700
            transition
            hover:bg-slate-100
        `;

        secondary.innerHTML = `
            <i class="fa-solid fa-${secondaryButtonIcon} mr-2"></i>
            ${secondaryButtonText}
        `;

        secondary.addEventListener(

            "click",

            () => {

                if (onSecondaryClick) {

                    onSecondaryClick();

                }

            }

        );

        actions.appendChild(secondary);

    }

    if (buttonText) {

        const primary = document.createElement("button");

        primary.type = "button";

        primary.className = `
            rounded-xl
            bg-yellow-400
            px-6
            py-3
            font-semibold
            text-navy-900
            transition
            hover:bg-yellow-300
        `;

        primary.innerHTML = `
            <i class="fa-solid fa-${buttonIcon} mr-2"></i>
            ${buttonText}
        `;

        primary.addEventListener(

            "click",

            () => {

                if (onButtonClick) {

                    onButtonClick();

                }

            }

        );

        actions.appendChild(primary);

    }

    top.append(

        info,

        actions

    );

    header.appendChild(top);

    if (stats.length) {

        const grid = document.createElement("div");

        grid.className = `
            mt-8
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
        `;

        stats.forEach(stat => {

            const card = document.createElement("div");

            card.className = `
                rounded-2xl
                bg-slate-50
                p-5
            `;

            card.innerHTML = `

                <p
                    class="
                        text-sm
                        text-slate-500
                    "
                >

                    ${stat.label}

                </p>

                <h3
                    class="
                        mt-2
                        text-3xl
                        font-bold
                        text-navy-900
                    "
                >

                    ${stat.value}

                </h3>

            `;

            grid.appendChild(card);

        });

        header.appendChild(grid);

    }

    return header;

}