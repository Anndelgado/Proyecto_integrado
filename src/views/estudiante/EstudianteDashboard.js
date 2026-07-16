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

import { navigate } from "../../router.js";
import { getSession } from "../../session.js";

import { getTests } from "../../services/TestService.js";
import { getAsignaciones } from "../../services/AsignacionService.js";
import { getResultados } from "../../services/ResultadoService.js";

//======================================================
// Estados posibles según el resultado más reciente
//======================================================

const ESTADOS = {

    estable: {

        text: "Estable 😊",

        icon: "heart-pulse",

        color: "green"

    },

    atencion: {

        text: "En Observación 👀",

        icon: "heart-pulse",

        color: "yellow"

    },

    riesgo: {

        text: "Requiere Apoyo 🤝",

        icon: "heart-pulse",

        color: "red"

    }

};

//======================================================
// Recursos recomendados (contenido editorial fijo)
//======================================================

const RECURSOS_RECOMENDADOS = [

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

export async function EstudianteDashboard() {

    const session = getSession() || {};

    //==================================================
    // Datos reales del backend
    //==================================================

    const [tests, asignaciones, resultados] = await Promise.all([

        getTests().catch(() => []),

        getAsignaciones({ estudianteId: session.id }).catch(() => []),

        getResultados({ estudianteId: session.id }).catch(() => [])

    ]);

    const testsPendientes = asignaciones.filter(

        asignacion => asignacion.estado === "pendiente"

    );

    const testsCompletados = asignaciones.filter(

        asignacion => asignacion.estado === "completado"

    );

    const ultimoResultado = resultados[0] ?? null;

    const estadoActual = ESTADOS[ultimoResultado?.nivel] ?? null;

    function buscarTest(testId) {

        return tests.find(test => test.id === testId) ?? {

            nombre: "Test",

            descripcion: "",

            icon: "clipboard-list"

        };

    }

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Header
    //==================================================

    const nombre = session.nombre ? `, ${session.nombre}` : "";

    page.appendChild(

        PageHeader({

            title: `Hola${nombre} 👋`,

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

            title: "Test Activos",

            value: String(testsPendientes.length),

            icon: "clipboard-list",

            color: "blue"

        }),

        StatCard({

            title: "Test Completados",

            value: String(testsCompletados.length),

            icon: "circle-check",

            color: "green"

        }),

        StatCard({

            title: "Mi Estado Actual",

            value: estadoActual ? estadoActual.text : "Aún sin datos",

            icon: estadoActual ? estadoActual.icon : "heart-pulse",

            color: estadoActual ? estadoActual.color : "navy"

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
    // Mis test activos
    //===========================================

    const testsContainer = document.createElement("div");

    testsContainer.className = `
        xl:col-span-2
    `;

    const testsList = document.createElement("div");

    if (testsPendientes.length) {

        testsList.className = `
            flex
            flex-col
            divide-y
            divide-slate-100
        `;

        testsPendientes.forEach(asignacion => {

            const test = buscarTest(asignacion.testId);

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
                    <i class="fa-solid fa-${test.icon}"></i>
                </div>

                <div>
                    <p class="font-semibold text-navy-900">
                        ${test.nombre}
                    </p>

                    <p class="mt-1 text-sm text-slate-500">
                        ${test.descripcion}
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

                        navigate("/estudiante/test");

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

        testsList.className = `
            flex
            flex-col
            items-center
            gap-3
            py-10
            text-center
        `;

        testsList.innerHTML = `
            <div
                class="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-emerald-100
                    text-emerald-600
                "
            >
                <i class="fa-solid fa-circle-check text-xl"></i>
            </div>

            <p class="font-semibold text-navy-900">
                ¡Estás al día!
            </p>

            <p class="max-w-sm text-sm text-slate-500">
                No tienes test pendientes por responder en este momento.
            </p>
        `;

    }

    testsContainer.appendChild(

        Card({

            title: "Mis Test Activos",

            subtitle: "Responde a tiempo para conocer tu bienestar",

            content: testsList

        })

    );

    bottomGrid.appendChild(testsContainer);

    //===========================================
    // Recursos recomendados
    //===========================================

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

    RECURSOS_RECOMENDADOS.forEach(recurso => {

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

        title: "Hola, Estudiante 👋",

        content: page

    });

}
