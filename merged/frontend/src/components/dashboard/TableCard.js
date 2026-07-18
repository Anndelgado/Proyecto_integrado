// ======================================================
// TableCard.js
// Barranquilla Convive
// ======================================================

import { Card } from "../ui/Card.js";

export function TableCard({

    title = "",

    subtitle = "",

    headers = [],

    rows = [],

    emptyMessage = "No hay información disponible."

} = {}) {

    const container = document.createElement("div");

    container.className = "overflow-x-auto";

    const table = document.createElement("table");

    table.className = `
        min-w-full
        border-separate
        border-spacing-0
    `;

    //=========================================
    // Header
    //=========================================

    const thead = document.createElement("thead");

    thead.innerHTML = `
        <tr>

            ${headers.map(header => `

                <th
                    class="
                        sticky
                        top-0
                        bg-slate-50
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-500
                        border-b
                        border-slate-200
                    "
                >

                    ${header}

                </th>

            `).join("")}

        </tr>
    `;

    table.appendChild(thead);

    //=========================================
    // Body
    //=========================================

    const tbody = document.createElement("tbody");

    if (!rows.length) {

        const tr = document.createElement("tr");

        const td = document.createElement("td");

        td.colSpan = headers.length;

        td.className = `
            py-12
            text-center
            text-slate-400
        `;

        td.innerHTML = `

            <div
                class="
                    flex
                    flex-col
                    items-center
                    gap-4
                "
            >

                <i
                    class="
                        fa-solid
                        fa-folder-open
                        text-5xl
                    "
                ></i>

                <p>

                    ${emptyMessage}

                </p>

            </div>

        `;

        tr.appendChild(td);

        tbody.appendChild(tr);

    }
        rows.forEach((row, rowIndex) => {

        const tr = document.createElement("tr");

        tr.className = `
            transition-all
            duration-200
            hover:bg-yellow-50
            ${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
        `;

        row.forEach(cell => {

            const td = document.createElement("td");

            td.className = `
                px-6
                py-5
                align-middle
                border-b
                border-slate-100
                text-sm
                text-slate-700
            `;

            //====================================
            // Soporta HTML
            //====================================

            if (typeof cell === "string") {

                td.innerHTML = cell;

            }

            //====================================
            // Soporta HTMLElement
            //====================================

            else if (cell instanceof HTMLElement) {

                td.appendChild(cell);

            }

            //====================================
            // Soporta números
            //====================================

            else {

                td.textContent = cell;

            }

            tr.appendChild(td);

        });

        tbody.appendChild(tr);

    });

    table.appendChild(tbody);

    container.appendChild(table);

        //=========================================
    // Footer
    //=========================================

    const footer = document.createElement("div");

    footer.className = `
        flex
        items-center
        justify-between
        border-t
        border-slate-200
        bg-slate-50
        px-6
        py-4
        text-sm
        text-slate-500
    `;

    footer.innerHTML = `

        <span>

            Total de registros:
            <strong class="text-navy-900">

                ${rows.length}

            </strong>

        </span>

        <span>

            Barranquilla Convive

        </span>

    `;

    const wrapper = document.createElement("div");

    wrapper.className = `
        overflow-hidden
        rounded-2xl
    `;

    wrapper.append(

        container,

        footer

    );

    return Card({

        title,

        subtitle,

        content: wrapper

    });

}