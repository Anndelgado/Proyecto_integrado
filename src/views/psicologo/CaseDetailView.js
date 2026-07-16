// ======================================================
// CaseDetailView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";

import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";
import { Avatar } from "../../components/ui/Avatar.js";
import { Button } from "../../components/ui/Button.js";

import { getParams } from "../../router.js";

//======================================================
// Datos de ejemplo
// (en una versión conectada a la API esto vendría de
// GET /alertas/:id o similar, usando el id de la ruta)
//======================================================

const CASOS = {

    "1256": {

        id: "1256",

        estudiante: "Andrés Duarte",

        institucion: "IED La Concepción",

        curso: "9°A",

        nivel: "Alto",

        fecha: "21/05/2026",

        estado: "Pendiente de evaluación",

        descripcion:
            "El docente reportó aislamiento social, cambios de ánimo y bajo rendimiento académico en las últimas semanas. Ha mostrado desmotivación y tristeza constante."

    },

    "1255": {

        id: "1255",

        estudiante: "Samuel Ortega",

        institucion: "IED Jorge Robledo",

        curso: "9°A",

        nivel: "Medio",

        fecha: "18/05/2026",

        estado: "En seguimiento",

        descripcion:
            "Se reportaron episodios de irritabilidad y dificultad para relacionarse con sus compañeros. Actualmente en seguimiento por el equipo de orientación."

    }

};

export function CaseDetailView() {

    const { id } = getParams();

    const caso = CASOS[id] ?? Object.values(CASOS)[0];

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Encabezado del caso
    //==================================================

    const header = document.createElement("section");

    header.className = `
        flex
        flex-col
        gap-6
        rounded-3xl
        bg-white
        p-8
        shadow-sm
        lg:flex-row
        lg:items-center
        lg:justify-between
    `;

    const headerInfo = document.createElement("div");

    headerInfo.className = `
        flex
        items-center
        gap-5
    `;

    const avatar = Avatar({

        name: caso.estudiante,

        size: "xl"

    });

    const headerText = document.createElement("div");

    headerText.innerHTML = `
        <p class="text-sm font-medium text-slate-400">
            Caso #${caso.id}
        </p>

        <h1 class="mt-1 text-2xl font-bold text-navy-900">
            ${caso.estudiante}
        </h1>

        <p class="mt-2 text-sm text-slate-500">
            ${caso.institucion} · ${caso.curso} · Alerta registrada el ${caso.fecha}
        </p>
    `;

    headerInfo.append(

        avatar,

        headerText

    );

    const headerBadge = document.createElement("div");

    headerBadge.className = `
        flex
        items-center
        gap-3
    `;

    headerBadge.append(

        Badge({

            text: `Nivel: ${caso.nivel}`,

            variant: "danger"

        })

    );

    header.append(

        headerInfo,

        headerBadge

    );

    page.appendChild(header);

    //==================================================
    // Tabs (visual)
    //==================================================

    const tabs = document.createElement("div");

    tabs.className = `
        flex
        gap-2
        overflow-x-auto
        rounded-2xl
        bg-white
        p-2
        shadow-sm
    `;

    const tabNames = [

        "Información",

        "Historial",

        "Evaluaciones",

        "Seguimiento"

    ];

    tabNames.forEach((name, index) => {

        const tab = document.createElement("button");

        tab.type = "button";

        tab.className = `
            shrink-0
            rounded-xl
            px-5
            py-3
            text-sm
            font-semibold
            transition

            ${
                index === 0
                    ? "bg-yellow-400 text-navy-900"
                    : "text-slate-500 hover:bg-slate-100"
            }
        `;

        tab.textContent = name;

        tabs.appendChild(tab);

    });

    page.appendChild(tabs);

    //==================================================
    // Información + Acciones
    //==================================================

    const grid = document.createElement("section");

    grid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

    //===========================================
    // Información del caso
    //===========================================

    const infoBody = document.createElement("div");

    infoBody.className = `
        flex
        flex-col
        gap-6
    `;

    infoBody.innerHTML = `
        <p class="text-sm leading-7 text-slate-600">
            ${caso.descripcion}
        </p>

        <div>
            <p class="text-sm font-medium text-slate-400">
                Estado actual
            </p>
        </div>
    `;

    infoBody.querySelector("div").appendChild(

        Badge({

            text: caso.estado,

            variant: "warning"

        })

    );

    const infoContainer = document.createElement("div");

    infoContainer.className = "xl:col-span-2";

    infoContainer.appendChild(

        Card({

            title: "Información del Caso",

            content: infoBody

        })

    );

    grid.appendChild(infoContainer);

    //===========================================
    // Acciones
    //===========================================

    const accionesBody = document.createElement("div");

    accionesBody.className = `
        flex
        flex-col
        gap-3
    `;

    const agregarObservacion = document.createElement("button");

    agregarObservacion.type = "button";

    agregarObservacion.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-slate-700
        transition
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
    `;

    agregarObservacion.innerHTML = `
        <i class="fa-solid fa-note-sticky w-5 text-center"></i>
        <span>Agregar observación</span>
    `;

    const programarSeguimiento = document.createElement("button");

    programarSeguimiento.type = "button";

    programarSeguimiento.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-slate-700
        transition
        hover:border-yellow-200
        hover:bg-yellow-50
        hover:text-yellow-700
    `;

    programarSeguimiento.innerHTML = `
        <i class="fa-solid fa-calendar-plus w-5 text-center"></i>
        <span>Programar seguimiento</span>
    `;

    const cerrarCaso = document.createElement("button");

    cerrarCaso.type = "button";

    cerrarCaso.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-red-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-red-600
        transition
        hover:bg-red-50
    `;

    cerrarCaso.innerHTML = `
        <i class="fa-solid fa-circle-check w-5 text-center"></i>
        <span>Cerrar caso</span>
    `;

    accionesBody.append(

        agregarObservacion,

        programarSeguimiento,

        cerrarCaso

    );

    grid.appendChild(

        Card({

            title: "Acciones",

            content: accionesBody

        })

    );

    page.appendChild(grid);

    //==================================================

    return DashboardLayout({

        activePath: "/psicologo/casos",

        title: `Caso #${caso.id}`,

        content: page

    });

}
