

import { Card } from "../ui/Card.js";

export function ChartCard({

    title = "",

    subtitle = "",

    height = "320px",

    content = null

} = {}) {

    const body = document.createElement("div");

    body.style.height = height;

    body.className = `
        flex
        items-center
        justify-center
    `;

    if (content instanceof HTMLElement) {

        body.appendChild(content);

    } else {

        body.innerHTML = `
            <div
                class="
                    flex
                    flex-col
                    items-center
                    gap-3
                    text-slate-400
                "
            >

                <i
                    class="
                        fa-solid
                        fa-chart-column
                        text-5xl
                    "
                ></i>

                <p class="text-sm">

                    Gráfica disponible próximamente

                </p>

            </div>
        `;

    }

    return Card({

        title,

        subtitle,

        content: body

    });

}