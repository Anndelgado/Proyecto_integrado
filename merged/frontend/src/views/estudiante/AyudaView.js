// ======================================================
// AyudaView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";

import { getSession } from "../../session.js";
import { createAlerta } from "../../services/AlertaService.js";

// Líneas de apoyo verificadas para Barranquilla y a nivel nacional.
const LINEAS_DE_APOYO = [

    {
        nombre: "Línea de la Vida",
        numero: "(605) 339 9999",
        descripcion: "Atención en crisis emocional y prevención del suicidio en Barranquilla, las 24 horas.",
        icon: "phone-volume",
        href: "tel:+6053399999"
    },

    {
        nombre: "Línea de Salud Mental Distrital",
        numero: "315 300 2003",
        descripcion: "Orientación psicológica gratuita para residentes de Barranquilla, las 24 horas.",
        icon: "comment-medical",
        href: "tel:+573153002003"
    },

    {
        nombre: "Línea Charlemos (WhatsApp)",
        numero: "318 804 4000",
        descripcion: "Escríbeles por WhatsApp si prefieres no hablar por teléfono, las 24 horas.",
        icon: "whatsapp",
        iconPrefix: "fa-brands",
        href: "https://wa.me/573188044000"
    },

    {
        nombre: "Línea 123 · Emergencias",
        numero: "123",
        descripcion: "Para cualquier emergencia que ponga en riesgo tu vida o la de alguien más.",
        icon: "triangle-exclamation",
        href: "tel:123"
    },

    {
        nombre: "ICBF · Niños, niñas y adolescentes",
        numero: "141",
        descripcion: "Línea del Instituto Colombiano de Bienestar Familiar para proteger tus derechos.",
        icon: "shield-heart",
        href: "tel:141"
    }

];

const PREGUNTAS_FRECUENTES = [

    {
        pregunta: "¿Quién puede ver mis respuestas de los test?",
        respuesta: "Solo tu docente y el equipo de orientación de tu institución pueden ver un resumen de tus resultados, con el fin de acompañarte mejor. Tus respuestas se manejan de forma confidencial."
    },

    {
        pregunta: "¿Qué pasa si pido apoyo desde esta página?",
        respuesta: "Se notifica al equipo de orientación de tu institución para que se ponga en contacto contigo lo antes posible. No es una línea de emergencia inmediata: si tu vida está en riesgo, comunícate primero con una de las líneas telefónicas de esta página."
    },

    {
        pregunta: "¿Tengo que estar en una crisis para pedir ayuda?",
        respuesta: "No. Puedes acudir a estos recursos aunque solo quieras conversar, entender lo que sientes o prevenir que una situación se agrave."
    }

];

export function AyudaView() {

    const session = getSession() || {};

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

            title: "Ayuda",

            subtitle: "Si necesitas hablar con alguien, no estás solo/a. Aquí encuentras líneas de apoyo y la posibilidad de contactar a tu equipo de orientación.",

            icon: "hand-holding-heart"

        })

    );

    //==================================================
    // Aviso de emergencia
    //==================================================

    const aviso = document.createElement("div");

    aviso.className = `
        flex
        flex-col
        items-start
        gap-4
        rounded-3xl
        border
        border-red-200
        bg-red-50
        p-6
        sm:flex-row
        sm:items-center
        sm:justify-between
    `;

    aviso.innerHTML = `

        <div class="flex items-start gap-4">

            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <i class="fa-solid fa-heart-pulse text-xl"></i>
            </div>

            <div>
                <p class="font-semibold text-red-800">
                    ¿Tu vida o la de alguien más está en riesgo ahora mismo?
                </p>
                <p class="mt-1 text-sm text-red-700">
                    Llama de inmediato a la Línea de la Vida o a la línea de Emergencias 123.
                </p>
            </div>

        </div>

    `;

    const llamarBtn = document.createElement("a");

    llamarBtn.href = "tel:+6053399999";

    llamarBtn.className = `
        inline-flex
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-red-600
        px-5
        py-3
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-red-700
    `;

    llamarBtn.innerHTML = `
        <i class="fa-solid fa-phone"></i>
        Llamar ahora
    `;

    aviso.appendChild(llamarBtn);

    page.appendChild(aviso);

    //==================================================
    // Líneas de apoyo
    //==================================================

    const lineasGrid = document.createElement("section");

    lineasGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    LINEAS_DE_APOYO.forEach(linea => {

        const body = document.createElement("a");

        body.href = linea.href;

        body.target = linea.href.startsWith("http") ? "_blank" : "_self";

        body.rel = "noopener";

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
                    bg-emerald-100
                    text-emerald-600
                "
            >

                <i class="${linea.iconPrefix ?? "fa-solid"} fa-${linea.icon} text-xl"></i>

            </div>

            <div>

                <h3 class="text-lg font-semibold text-navy-900">

                    ${linea.nombre}

                </h3>

                <p class="mt-1 text-base font-semibold text-emerald-600">

                    ${linea.numero}

                </p>

                <p class="mt-2 text-sm leading-6 text-slate-500">

                    ${linea.descripcion}

                </p>

            </div>

        `;

        lineasGrid.appendChild(

            Card({

                content: body

            })

        );

    });

    page.appendChild(lineasGrid);

    //==================================================
    // Contactar a orientación + Preguntas frecuentes
    //==================================================

    const bottomGrid = document.createElement("section");

    bottomGrid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;

    //===========================================
    // Solicitar apoyo
    //===========================================

    const contactoBody = document.createElement("div");

    contactoBody.className = `
        flex
        flex-col
        items-start
        gap-4
    `;

    contactoBody.innerHTML = `

        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <i class="fa-solid fa-user-doctor text-xl"></i>
        </div>

        <p class="text-sm leading-6 text-slate-500">
            Si prefieres hablar con alguien de tu colegio, solicita que el equipo de orientación te contacte. Ellos revisarán tu solicitud y se comunicarán contigo.
        </p>

    `;

    const solicitarBtn = Button({

        text: "Solicitar apoyo",

        icon: "paper-plane",

        fullWidth: true,

        async onClick() {

            solicitarBtn.disabled = true;

            try {

                await createAlerta({

                    estudianteId: session.id,

                    institucionId: session.institucionId,

                    cursoId: session.cursoId,

                    nivelRiesgo: "medio",

                    descripcion: "El estudiante solicitó apoyo de orientación desde la sección de Ayuda.",

                    estado: "pendiente",

                    fecha: new Date().toISOString().slice(0, 10)

                });

                alert("Tu solicitud fue enviada. El equipo de orientación de tu institución se pondrá en contacto contigo pronto.");

            } catch (error) {

                alert("No se pudo enviar tu solicitud. Por favor intenta de nuevo o comunícate directamente con una de las líneas de apoyo.");

            } finally {

                solicitarBtn.disabled = false;

            }

        }

    });

    contactoBody.appendChild(solicitarBtn);

    bottomGrid.appendChild(

        Card({

            title: "¿Prefieres hablar con tu colegio?",

            content: contactoBody

        })

    );

    //===========================================
    // Preguntas frecuentes
    //===========================================

    const faqWrapper = document.createElement("div");

    faqWrapper.className = "xl:col-span-2";

    const faqList = document.createElement("div");

    faqList.className = `
        flex
        flex-col
        divide-y
        divide-slate-100
    `;

    PREGUNTAS_FRECUENTES.forEach(item => {

        const details = document.createElement("details");

        details.className = "group py-4";

        details.innerHTML = `

            <summary
                class="
                    flex
                    cursor-pointer
                    list-none
                    items-center
                    justify-between
                    gap-4
                    font-semibold
                    text-navy-900
                "
            >
                ${item.pregunta}

                <i class="fa-solid fa-chevron-down text-sm text-slate-400 transition group-open:rotate-180"></i>

            </summary>

            <p class="mt-3 text-sm leading-6 text-slate-500">
                ${item.respuesta}
            </p>

        `;

        faqList.appendChild(details);

    });

    faqWrapper.appendChild(

        Card({

            title: "Preguntas Frecuentes",

            content: faqList

        })

    );

    bottomGrid.appendChild(faqWrapper);

    page.appendChild(bottomGrid);

    //==================================================

    return DashboardLayout({

        activePath: "/estudiante/ayuda",

        title: "Ayuda",

        content: page

    });

}
