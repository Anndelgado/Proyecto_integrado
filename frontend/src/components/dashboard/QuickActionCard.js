
import { Card } from "../ui/Card.js";

export function QuickActionCard({

    title = "",

    description = "",

    icon = "bolt",

    color = "yellow",

    onClick = null

} = {}) {

    const colors = {

        yellow: `
            bg-yellow-100
            text-yellow-600
        `,

        blue: `
            bg-blue-100
            text-blue-600
        `,

        green: `
            bg-emerald-100
            text-emerald-600
        `,

        red: `
            bg-red-100
            text-red-600
        `,

        navy: `
            bg-slate-200
            text-navy-900
        `

    };

    const body = document.createElement("button");

    body.type = "button";

    body.className = `
        group
        flex
        w-full
        flex-col
        items-start
        gap-5
        rounded-2xl
        transition-all
        duration-300
        hover:-translate-y-1
    `;

    body.innerHTML = `

        <div
            class="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                ${colors[color]}
                transition-transform
                duration-300
                group-hover:scale-110
            "
        >

            <i
                class="
                    fa-solid
                    fa-${icon}
                    text-xl
                "
            ></i>

        </div>

        <div>

            <h3
                class="
                    text-lg
                    font-semibold
                    text-navy-900
                "
            >
                ${title}
            </h3>

            <p
                class="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                "
            >
                ${description}
            </p>

        </div>

    `;

    if (onClick) {

        body.addEventListener(

            "click",

            onClick

        );

    }

    return Card({

        content: body

    });

}