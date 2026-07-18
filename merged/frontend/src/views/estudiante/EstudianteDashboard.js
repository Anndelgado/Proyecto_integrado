// ======================================================
// EstudianteDashboard.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";

import { PageHeader } from "../../components/layout/PageHeader.js";

import { StatCard } from "../../components/dashboard/StatCard.js";
import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";

import { getSession } from "../../session.js";
import { navigate } from "../../router.js";

import {
    getTamizajePorId,
    getHabilitacionesEstudiante,
    getResultadosEstudiante
} from "../../services/TamizajeService.js";

const ESTADO_ACTUAL = {

    Bajo: { texto: "Estable <i class=\"fa-regular fa-face-smile\"></i>", color: "green" },

    Medio: { texto: "En seguimiento <i class=\"fa-solid fa-triangle-exclamation\"></i>", color: "yellow" },

    Alto: { texto: "Requiere atención <i class=\"fa-solid fa-circle-exclamation\"></i>", color: "red" }

};

export async function EstudianteDashboard() {

    const session = getSession() || {};

    const [habilitaciones, resultados] = await Promise.all([

        getHabilitacionesEstudiante(session.id).catch(() => []),

        getResultadosEstudiante(session.id).catch(() => [])

    ]);

    const activas = habilitaciones.filter(h => h.estado === "activa");

    const ultimoResultado = resultados[0] ?? null;

    const estadoActual = ultimoResultado
        ? (ESTADO_ACTUAL[ultimoResultado.nivel] ?? { texto: ultimoResultado.nivel, color: "blue" })
        : { texto: "Sin datos aún", color: "blue" };

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Header
    //==================================================

    page.appendChild(

        PageHeader({

            title: `Hola, ${session.nombre ?? "Estudiante"} <i class="fa-regular fa-hand"></i>`,

            subtitle: "¡Nos alegra tenerte aquí! Este es tu espacio para cuidar tu bienestar emocional.",

            icon: "face-smile"

        })

    );

    //==================================================
    // Estadísticas
    //==================================================

    const statsGrid = document.createElement("section");

    statsGrid.className = `
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
    `;

    statsGrid.append(

        StatCard({

            title: "Tamizajes Activos",

            value: String(activas.length),

            icon: "clipboard-list",

            color: "blue"

        }),

        StatCard({

            title: "Tamizajes Completados",

            value: String(resultados.length),

            icon: "circle-check",

            color: "green"

        }),

        StatCard({

            title: "Mi Estado Actual",

            value: estadoActual.texto,

            icon: "heart-pulse",

            color: estadoActual.color

        })

    );

    page.appendChild(statsGrid);

    //==================================================
    // Test activos + Recursos recomendados
    //==================================================

    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

    //===========================================
    // Mis tamizajes activos
    //===========================================

    const testsContainer = document.createElement("div");

    testsContainer.className = `
        xl:col-span-2
    `;

    const testsList = document.createElement("div");

    testsList.className = `
        flex
        flex-col
        divide-y
        divide-slate-100
    `;

    if (activas.length) {

        activas.forEach(habilitacion => {

            const test = getTamizajePorId(habilitacion.testId);

            const row = document.createElement("div");

            row.className = `
                flex
                flex-col
                gap-4
                py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
            `;

            const info = document.createElement("div");

            info.className = `
                flex
                items-start
                gap-4
            `;

            info.innerHTML = `
                <div
                    class="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-yellow-100
                        text-yellow-600
                    "
                >
                    <i class="fa-solid fa-${test?.icon ?? "clipboard-list"}"></i>
                </div>

                <div>
                    <p class="font-semibold text-navy-900">
                        ${habilitacion.testNombre}
                    </p>

                    <p class="mt-1 text-sm text-slate-500">
                        ${test?.descripcion ?? "Habilitado por tu psicólogo/a de orientación."}
                    </p>
                </div>
            `;

            const actions = document.createElement("div");

            actions.className = `
                flex
                shrink-0
                items-center
                gap-3
                sm:pl-4
            `;

            actions.appendChild(

                Badge({

                    text: "Pendiente",

                    variant: "warning"

                })

            );

            actions.appendChild(

                Button({

                    text: "Responder",

                    icon: "arrow-right",

                    variant: "primary",

                    size: "sm",

                    onClick() {

                        navigate("/estudiante/tamizaje");

                    }

                })

            );

            row.append(

                info,

                actions

            );

            testsList.appendChild(row);

        });

    } else {

        const empty = document.createElement("div");

        empty.className = `
            flex
            flex-col
            items-center
            gap-3
            py-10
            text-center
            text-slate-400
        `;

        empty.innerHTML = `
            <i class="fa-solid fa-circle-check text-3xl"></i>
            <p class="text-sm">
                No tienes tamizajes pendientes por el momento.
            </p>
        `;

        testsList.appendChild(empty);

    }

    testsContainer.appendChild(

        Card({

            title: "Mis Tamizajes Activos",

            subtitle: "Responde a tiempo para conocer tu bienestar",

            content: testsList

        })

    );

    bottomGrid.appendChild(testsContainer);

    //===========================================
    // Recursos recomendados
    //===========================================

    const recursosData = [

        {

            titulo: "Manejo del estrés",

            descripcion: "Consejos prácticos para tu día a día.",

            icon: "spa",

            color: "blue"

        },

        {

            titulo: "Autoestima positiva",

            descripcion: "Aprende a valorarte.",

            icon: "heart",

            color: "yellow"

        },

        {

            titulo: "¿Necesitas ayuda?",

            descripcion: "Líneas y contactos de apoyo.",

            icon: "hands-holding-child",

            color: "green"

        }

    ];

    const colors = {

        yellow: "bg-yellow-100 text-yellow-600",

        blue: "bg-blue-100 text-blue-600",

        green: "bg-emerald-100 text-emerald-600"

    };

    const recursosList = document.createElement("div");

    recursosList.className = `
        flex
        flex-col
        divide-y
        divide-slate-100
    `;

    recursosData.forEach(recurso => {

        const item = document.createElement("div");

        item.className = `
            flex
            items-center
            gap-4
            py-4
        `;

        item.innerHTML = `
            <div
                class="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${colors[recurso.color]}
                "
            >
                <i class="fa-solid fa-${recurso.icon}"></i>
            </div>

            <div class="min-w-0 flex-1">
                <p class="truncate font-semibold text-navy-900">
                    ${recurso.titulo}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                    ${recurso.descripcion}
                </p>
            </div>

            <i class="fa-solid fa-chevron-right text-xs text-slate-300"></i>
        `;

        recursosList.appendChild(item);

    });

    const recursosFooter = document.createElement("div");

    recursosFooter.className = "pt-4 text-center";

    recursosFooter.innerHTML = `
        <a
            href="/estudiante/recursos"
            data-link
            class="text-sm font-semibold text-yellow-600 hover:underline"
        >
            Ver más recursos
        </a>
    `;

    const recursosWrapper = document.createElement("div");

    recursosWrapper.append(

        recursosList,

        recursosFooter

    );

    bottomGrid.appendChild(

        Card({

            title: "Recursos Recomendados",

            content: recursosWrapper

        })

    );

    page.appendChild(bottomGrid);

    //==================================================

    return DashboardLayout({

        activePath: "/estudiante",

        title: "Hola, Estudiante <i class=\"fa-regular fa-hand\"></i>",

        content: page

    });

}
