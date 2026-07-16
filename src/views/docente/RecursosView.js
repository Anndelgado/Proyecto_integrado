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
            flex-col
            gap-4
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
                    bg-slate-100
                    text-slate-600
                "
            >

                <i class="fa-solid fa-${recurso.icon} text-xl"></i>

            </div>

            <div>

                <h3 class="text-lg font-semibold text-navy-900">

                    ${recurso.titulo}

                </h3>

                <p class="mt-2 text-sm leading-6 text-slate-500">

                    ${recurso.descripcion}

                </p>

            </div>

        `;

        body.prepend(

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
