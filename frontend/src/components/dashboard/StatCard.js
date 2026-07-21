
import { Card } from "../ui/Card.js";

export function StatCard({

    title = "",

    value = "0",

    icon = "chart-line",

    color = "yellow",

    percentage = "",

    trend = "up",

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
            text-slate-700
        `

    };

    const body = document.createElement("div");

    body.className = `
        flex
        items-start
        justify-between
    `;

    body.innerHTML = `

        <div>

            <p
                class="
                    text-sm
                    font-medium
                    text-slate-500
                "
            >
                ${title}
            </p>

            <h2
                class="
                    mt-3
                    text-4xl
                    font-bold
                    text-slate-800
                "
            >
                ${value}
            </h2>

            ${
                percentage
                    ? `
                        <div
                            class="
                                mt-4
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                class="
                                    flex
                                    items-center
                                    gap-1
                                    text-sm
                                    font-semibold

                                    ${
                                        trend === "up"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    }
                                "
                            >

                                <i
                                    class="
                                        fa-solid
                                        ${
                                            trend === "up"
                                                ? "fa-arrow-trend-up"
                                                : "fa-arrow-trend-down"
                                        }
                                    "
                                ></i>

                                ${percentage}

                            </span>

                            <span
                                class="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                este mes
                            </span>

                        </div>
                    `
                    : ""
            }

        </div>

        <div
            class="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                ${colors[color]}
                shadow-sm
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

    `;

    return Card({

        content: body,

    });

}