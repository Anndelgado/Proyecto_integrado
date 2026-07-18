// ======================================================
// TestView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { QuickActionCard } from "../../components/dashboard/QuickActionCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";
import { Modal } from "../../components/ui/Modal.js";

import { openModal, closeModal } from "../../utils/modal.js";
import { getSession } from "../../session.js";
import { navigate } from "../../router.js";

import {
    getCatalogoTests,
    getOpciones,
    getResultados,
    guardarResultado
} from "../../services/TestService.js";

export async function TestView() {

    const session = getSession() || {};

    const catalogo = getCatalogoTests();

    let resultados = await getResultados(session.id).catch(() => []);

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

            title: "Mis Test",

            subtitle: "Responde estos test para conocer y hacer seguimiento a tu bienestar emocional. Tus respuestas son confidenciales.",

            icon: "clipboard-list",

            stats: [

                { label: "Test disponibles", value: catalogo.length },

                { label: "Test completados", value: resultados.length }

            ]

        })

    );

    //==================================================
    // Catálogo de test
    //==================================================

    const testsGrid = document.createElement("section");

    testsGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    catalogo.forEach(test => {

        const card = QuickActionCard({

            title: test.nombre,

            description: test.descripcion,

            icon: test.icon,

            color: test.color,

            onClick() {

                abrirCuestionario(test);

            }

        });

        const hoy = new Date().toISOString().slice(0, 10);

        const completadoHoy = resultados.some(
            r => r.testId === test.id && r.fecha === hoy
        );

        if (completadoHoy) {

            const badgeWrapper = document.createElement("div");

            badgeWrapper.className = "mb-1";

            badgeWrapper.appendChild(

                Badge({ text: "Respondido hoy", variant: "success" })

            );

            card.firstElementChild.prepend(badgeWrapper);

        }

        testsGrid.appendChild(card);

    });

    page.appendChild(testsGrid);

    //==================================================
    // Historial reciente
    //==================================================

    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function renderHistorial() {

        tableContainer.innerHTML = "";

        const ultimosResultados = resultados.slice(0, 5);

        const wrapper = document.createElement("div");

        wrapper.appendChild(

            TableCard({

                title: "Historial Reciente",

                subtitle: "Tus últimos test respondidos",

                headers: [

                    "Test",

                    "Fecha",

                    "Puntaje",

                    "Nivel"

                ],

                rows: ultimosResultados.map(resultado => [

                    `<span class="flex items-center gap-3">
                        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <i class="fa-solid fa-${resultado.icon}"></i>
                        </span>
                        <span class="font-medium text-navy-900">${resultado.testNombre}</span>
                    </span>`,

                    resultado.fecha,

                    `${resultado.porcentaje}%`,

                    Badge({ text: resultado.nivel, variant: resultado.variant })

                ]),

                emptyMessage: "Aún no has respondido ningún test. ¡Elige uno arriba para comenzar!"

            })

        );

        if (ultimosResultados.length) {

            const footer = document.createElement("div");

            footer.className = "pt-5 text-center";

            footer.innerHTML = `
                <a
                    href="/estudiante/resultados"
                    data-link
                    class="text-sm font-semibold text-yellow-600 hover:underline"
                >
                    Ver todos mis resultados
                </a>
            `;

            wrapper.appendChild(footer);

        }

        tableContainer.appendChild(wrapper);

    }

    //==================================================
    // Cuestionario (modal)
    //==================================================

    function abrirCuestionario(test) {

        const opciones = getOpciones();

        const form = document.createElement("form");

        form.className = `
            flex
            flex-col
            gap-7
        `;

        const intro = document.createElement("p");

        intro.className = "text-sm leading-6 text-slate-500";

        intro.textContent = "Selecciona la opción que mejor describa cómo te has sentido en las últimas dos semanas. No hay respuestas correctas o incorrectas.";

        form.appendChild(intro);

        test.preguntas.forEach((pregunta, index) => {

            const group = document.createElement("fieldset");

            group.className = `
                rounded-2xl
                border
                border-slate-200
                p-5
            `;

            group.innerHTML = `
                <legend class="px-1 text-sm font-semibold text-navy-900">
                    ${index + 1}. ${pregunta}
                </legend>
            `;

            const optionsRow = document.createElement("div");

            optionsRow.className = `
                mt-4
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
            `;

            opciones.forEach((opcion, optIndex) => {

                const optionId = `q${index}_o${optIndex}`;

                const label = document.createElement("label");

                label.setAttribute("for", optionId);

                label.className = `
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    px-3
                    py-2
                    text-center
                    text-xs
                    font-medium
                    text-slate-600
                    transition
                    has-[:checked]:border-yellow-400
                    has-[:checked]:bg-yellow-50
                    has-[:checked]:text-navy-900
                    hover:bg-slate-50
                `;

                label.innerHTML = `
                    <input
                        type="radio"
                        id="${optionId}"
                        name="pregunta_${index}"
                        value="${opcion.valor}"
                        class="sr-only"
                        required
                    >
                    ${opcion.texto}
                `;

                optionsRow.appendChild(label);

            });

            group.appendChild(optionsRow);

            form.appendChild(group);

        });

        const actions = document.createElement("div");

        actions.className = `
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            pt-5
        `;

        actions.appendChild(

            Button({

                text: "Enviar respuestas",

                icon: "paper-plane",

                type: "submit"

            })

        );

        form.appendChild(actions);

        form.addEventListener(

            "submit",

            async (event) => {

                event.preventDefault();

                const data = new FormData(form);

                const respuestas = test.preguntas.map(
                    (_, index) => Number(data.get(`pregunta_${index}`))
                );

                const submitBtn = form.querySelector('button[type="submit"]');

                if (submitBtn) {

                    submitBtn.disabled = true;

                }

                try {

                    const resultado = await guardarResultado({

                        estudianteId: session.id,

                        test,

                        respuestas

                    });

                    resultados = await getResultados(session.id).catch(() => resultados);

                    closeModal();

                    mostrarResultado(resultado);

                    renderHistorial();

                } catch (error) {

                    if (submitBtn) {

                        submitBtn.disabled = false;

                    }

                    alert(error.message ?? "No se pudo guardar tu resultado. Intenta de nuevo.");

                }

            }

        );

        openModal(

            Modal({

                title: test.nombre,

                size: "lg",

                content: form

            })

        );

    }

    function mostrarResultado(resultado) {

        const content = document.createElement("div");

        content.className = `
            flex
            flex-col
            items-center
            gap-5
            py-4
            text-center
        `;

        content.innerHTML = `

            <div
                class="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-yellow-100
                    text-yellow-600
                "
            >
                <i class="fa-solid fa-${resultado.icon} text-3xl"></i>
            </div>

            <div>
                <p class="text-sm text-slate-500">Tu resultado en</p>
                <h3 class="text-xl font-bold text-navy-900">${resultado.testNombre}</h3>
            </div>

            <p class="text-5xl font-bold text-navy-900">${resultado.porcentaje}%</p>

        `;

        content.appendChild(

            Badge({ text: `Nivel ${resultado.nivel}`, variant: resultado.variant })

        );

        const nota = document.createElement("p");

        nota.className = "max-w-sm text-sm leading-6 text-slate-500";

        nota.textContent = "Recuerda que este resultado es solo una guía. Si sientes que necesitas apoyo, puedes escribirle a tu psicólogo/a desde la sección de Ayuda.";

        content.appendChild(nota);

        const irAyuda = Button({

            text: "Ir a Ayuda",

            icon: "hand-holding-heart",

            variant: "secondary",

            size: "sm",

            onClick() {

                closeModal();

                navigate("/estudiante/ayuda");

            }

        });

        content.appendChild(irAyuda);

        openModal(

            Modal({

                title: "¡Test completado!",

                size: "sm",

                content

            })

        );

    }

    renderHistorial();

    //==================================================

    return DashboardLayout({

        activePath: "/estudiante/test",

        title: "Mis Test",

        content: page

    });

}
