// ======================================================
// DataTable.js
// Barranquilla Convive
// ======================================================

import { Card } from "../ui/Card.js";

export function DataTable({

    title = "",

    subtitle = "",

    headers = [],

    rows = [],

    searchable = true,

    emptyMessage = "No hay información disponible."

} = {}) {

    let filteredRows = [...rows];

    //--------------------------------------------------

    const container = document.createElement("div");

    //--------------------------------------------------

    const wrapper = document.createElement("div");

    wrapper.className = "space-y-6";

    //--------------------------------------------------
    // Buscador
    //--------------------------------------------------

    if (searchable) {

        const search = document.createElement("div");

        search.className = `
            flex
            justify-end
        `;

        search.innerHTML = `

            <div class="relative w-full md:w-80">

                <i
                    class="
                        fa-solid
                        fa-magnifying-glass
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                    "
                ></i>

                <input

                    id="datatable-search"

                    type="text"

                    placeholder="Buscar..."

                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        py-3
                        pl-11
                        pr-4
                        outline-none
                        focus:border-yellow-400
                    "

                >

            </div>

        `;

        wrapper.appendChild(search);

    }

    //--------------------------------------------------
    // Tabla
    //--------------------------------------------------

    const tableContainer = document.createElement("div");

    tableContainer.className = `
        overflow-x-auto
    `;

    const table = document.createElement("table");

    table.className = `
        min-w-full
        border-collapse
    `;

    //--------------------------------------------------
    // Header
    //--------------------------------------------------

    const thead = document.createElement("thead");

    thead.className = "bg-slate-50";

    thead.innerHTML = `

        <tr>

            ${headers.map(header=>`

                <th

                    class="
                        px-6
                        py-4
                        text-left
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    "

                >

                    ${header}

                </th>

            `).join("")}

        </tr>

    `;

    table.appendChild(thead);

        //--------------------------------------------------
    // Body
    //--------------------------------------------------

    const tbody = document.createElement("tbody");

    table.appendChild(tbody);

    //--------------------------------------------------
    // Renderizar filas
    //--------------------------------------------------

    function renderRows(data = filteredRows) {

        tbody.innerHTML = "";

        if (data.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td

                        colspan="${headers.length}"

                        class="
                            px-6
                            py-12
                            text-center
                            text-slate-500
                        "

                    >

                        <div
                            class="
                                flex
                                flex-col
                                items-center
                                gap-3
                            "
                        >

                            <i
                                class="
                                    fa-solid
                                    fa-inbox
                                    text-5xl
                                    text-slate-300
                                "
                            ></i>

                            <p>

                                ${emptyMessage}

                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }

        data.forEach(row => {

            const tr = document.createElement("tr");

            tr.className = `
                border-t
                border-slate-100
                transition
                hover:bg-slate-50
            `;

            row.forEach(cell => {

                const td = document.createElement("td");

                td.className = `
                    px-6
                    py-4
                    text-sm
                    text-slate-700
                    align-middle
                `;

                td.innerHTML = cell;

                tr.appendChild(td);

            });

            tbody.appendChild(tr);

        });

    }

    //--------------------------------------------------

    renderRows();

    tableContainer.appendChild(table);

    wrapper.appendChild(tableContainer);

    //Búsqueda en tiempo real.
//🔄 Actualización automática.
//setRows().
//getRows().
//refresh().
//return del componente

