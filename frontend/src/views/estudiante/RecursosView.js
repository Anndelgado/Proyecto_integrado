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
        categoria: "Video",
        titulo: "Técnicas de respiración para calmar la ansiedad",
        descripcion: "Ejercicios cortos que puedes practicar antes de un examen o cuando te sientas abrumado/a.",
        icon: "wind",
        variant: "info"
    },

    {
        categoria: "Guía",
        titulo: "Cómo organizar mi tiempo de estudio",
        descripcion: "Consejos prácticos para manejar tus responsabilidades académicas sin estresarte.",
        icon: "calendar-check",
        variant: "info"
    },

    {
        categoria: "Guía",
        titulo: "Fortaleciendo mi autoestima",
        descripcion: "Actividades sencillas para reconocer tus cualidades y valorarte más.",
        icon: "star",
        variant: "success"
    },

    {
        categoria: "Video",
        titulo: "¿Qué hacer cuando me siento triste?",
        descripcion: "Estrategias para identificar y expresar lo que sientes de forma saludable.",
        icon: "cloud-rain",
        variant: "warning"
    },

    {
        categoria: "Herramienta",
        titulo: "Diario emocional",
        descripcion: "Escribe cómo te sientes cada día; ponerlo en palabras ayuda a entenderlo mejor.",
        icon: "book-open",
        variant: "neutral"
    },

    {
        categoria: "Protocolo",
        titulo: "¿A quién puedo acudir en mi colegio?",
        descripcion: "Conoce el paso a paso para hablar con tu docente o el equipo de orientación.",
        icon: "route",
        variant: "success"
    },

    {
        categoria: "Guía",
        titulo: "Manejo saludable de las redes sociales",
        descripcion: "Cómo cuidar tu bienestar emocional dentro y fuera de las pantallas.",
        icon: "mobile-screen",
        variant: "info"
    },

    {
        categoria: "Herramienta",
        titulo: "Ejercicios de mindfulness",
        descripcion: "Pausas activas de 5 minutos para reconectar contigo mismo/a durante el día.",
        icon: "spa",
        variant: "neutral"
    },

    {
        categoria: "Urgente",
        titulo: "¿Necesitas hablar con alguien ya?",
        descripcion: "Visita la sección de Ayuda para ver líneas de apoyo disponibles las 24 horas.",
        icon: "phone-volume",
        variant: "danger"
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

            subtitle: "Guías, videos y herramientas para cuidar tu bienestar emocional dentro y fuera del colegio.",

            icon: "book-open-reader"

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

        activePath: "/estudiante/recursos",

        title: "Recursos",

        content: page

    });

}
