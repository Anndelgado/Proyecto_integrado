// ======================================================
// RecursosView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";

const RECURSOS = [

    {
        categoria: "Guía",
        titulo: "Protocolo de Atención a Alertas Tempranas",
        descripcion: "Pasos a seguir cuando identificas una señal de riesgo en un estudiante.",
        icon: "book-open",
        variant: "info"
    },

    {
        categoria: "Guía",
        titulo: "Manual de Convivencia Escolar",
        descripcion: "Lineamientos distritales para la gestión de la convivencia en el aula.",
        icon: "book",
        variant: "info"
    },

    {
        categoria: "Video",
        titulo: "Primeros Auxilios Psicológicos",
        descripcion: "Cómo brindar una respuesta inicial ante una crisis emocional.",
        icon: "video",
        variant: "warning"
    },

    {
        categoria: "Video",
        titulo: "Comunicación Asertiva con Estudiantes",
        descripcion: "Estrategias para dialogar sobre temas sensibles con tus estudiantes.",
        icon: "video",
        variant: "warning"
    },

    {
        categoria: "Protocolo",
        titulo: "Ruta de Remisión a Orientación",
        descripcion: "Cuándo y cómo remitir un caso al equipo de psicología.",
        icon: "route",
        variant: "success"
    },

    {
        categoria: "Herramienta",
        titulo: "Banco de Actividades de Bienestar",
        descripcion: "Dinámicas de aula para fortalecer el bienestar socioemocional.",
        icon: "puzzle-piece",
        variant: "neutral"
    }

];

const ICON_COLORS = {
    info: "bg-blue-100 text-blue-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    neutral: "bg-slate-100 text-slate-600"
};

export function RecursosView() {

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Encabezado
    //==================================================

    page.appendChild(

        PageHeader({

            title: "Recursos",

            subtitle: "Guías, videos y protocolos de apoyo para la gestión socioemocional en el aula.",

            icon: "book-open"

        })

    );

    //==================================================
    // Recursos
    //==================================================

    const grid = document.createElement("section");

    grid.className = `
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
    `;

    RECURSOS.forEach(recurso => {

        const body = document.createElement("div");

        body.className = `
            flex
            h-full
            flex-col
            gap-5
        `;

        const iconColor = ICON_COLORS[recurso.variant] ?? ICON_COLORS.neutral;

        body.innerHTML = `

            <div
                class="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    class="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${iconColor}
                    "
                >

                    <i class="fa-solid fa-${recurso.icon} text-lg"></i>

                </div>

            </div>

            <div class="flex-1">

                <h3 class="text-lg font-semibold leading-snug text-navy-900">

                    ${recurso.titulo}

                </h3>

                <p class="mt-2 text-sm leading-6 text-slate-500">

                    ${recurso.descripcion}

                </p>

            </div>

        `;

        body.firstElementChild.appendChild(

            Badge({ text: recurso.categoria, variant: recurso.variant })

        );

        grid.appendChild(

            Card({

                content: body

            })

        );

    });

    page.appendChild(grid);

    //==================================================

    return DashboardLayout({

        activePath: "/docente/recursos",

        title: "Recursos",

        content: page

    });

}
