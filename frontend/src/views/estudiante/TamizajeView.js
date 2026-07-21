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
    getCatalogoTamizajes,
    getHabilitacionesEstudiante,
    getResultadosEstudiante,
    guardarResultado
} from "../../services/TamizajeService.js";

export async function TamizajeView() {

    const session = getSession() || {};

    const catalogo = getCatalogoTamizajes();

    const [habilitaciones, resultados] = await Promise.all([

        getHabilitacionesEstudiante(session.id).catch(() => []),

        getResultadosEstudiante(session.id).catch(() => [])

    ]);

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Tamizaje Psicológico",

            subtitle: "Estas pruebas las habilita tu psicólogo/a de orientación. Responde con sinceridad: tus respuestas son confidenciales y sirven para brindarte el acompañamiento adecuado.",

            icon: "notes-medical",

            stats: [

                { label: "Pruebas del sistema", value: catalogo.length },

                { label: "Completadas", value: resultados.length }

            ]

        })

    );
    const testsGrid = document.createElement("section");

    testsGrid.className = `
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
    `;

    function estadoDe(test) {

        const completado = resultados.some(r => r.testId === test.id);

        if (completado) return "completado";

        const habilitado = habilitaciones.some(
            h => h.testId === test.id && h.estado === "activa"
        );

        return habilitado ? "disponible" : "bloqueado";

    }

    function renderCatalogo() {

        testsGrid.innerHTML = "";

        catalogo.forEach(test => {

            const estado = estadoDe(test);

            const card = QuickActionCard({

                title: test.nombre,

                description: test.descripcion,

                icon: test.icon,

                color: test.color,

                onClick() {

                    if (estado === "disponible") {

                        abrirCuestionario(test);

                    }

                }

            });

            if (estado !== "disponible") {

                card.classList.add("opacity-70");

                const boton = card.querySelector("button");

                if (boton) boton.disabled = true;

            }

            const badgeWrapper = document.createElement("div");

            badgeWrapper.className = "mb-1";

            if (estado === "completado") {

                badgeWrapper.appendChild(Badge({ text: "Completado", variant: "success" }));

            } else if (estado === "disponible") {

                badgeWrapper.appendChild(Badge({ text: "Habilitado, listo para responder", variant: "info" }));

            } else {

                badgeWrapper.appendChild(Badge({ text: "Pendiente de habilitación", variant: "neutral" }));

            }

            card.firstElementChild.prepend(badgeWrapper);

            testsGrid.appendChild(card);

        });

    }

    renderCatalogo();

    page.appendChild(testsGrid);
    const tableContainer = document.createElement("div");

    page.appendChild(tableContainer);

    function renderHistorial() {

        tableContainer.innerHTML = "";

        tableContainer.appendChild(

            TableCard({

                title: "Mis Resultados de Tamizaje",

                subtitle: "Historial de pruebas de tamizaje que has respondido",

                headers: [

                    "Prueba",

                    "Fecha",

                    "Puntaje",

                    "Clasificación"

                ],

                rows: resultados.map(resultado => [

                    `<span class="flex items-center gap-3">
                        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <i class="fa-solid fa-${resultado.icon}"></i>
                        </span>
                        <span class="font-medium text-navy-900">${resultado.testNombre}</span>
                    </span>`,

                    resultado.fecha,

                    `${resultado.puntaje}/${resultado.puntajeMax}`,

                    Badge({ text: resultado.clasificacion, variant: resultado.variant })

                ]),

                emptyMessage: "Aún no has respondido ninguna prueba de tamizaje. Tu psicólogo/a debe habilitarlas primero."

            })

        );

    }

    renderHistorial();
    function abrirCuestionario(test) {

        const form = document.createElement("form");

        form.className = `
            flex
            flex-col
            gap-7
        `;

        const intro = document.createElement("p");

        intro.className = "text-sm leading-6 text-slate-500";

        intro.textContent = "Selecciona la opción que mejor describa tu situación. No hay respuestas correctas o incorrectas, y puedes hablar con tu psicólogo/a en cualquier momento desde la sección de Ayuda.";

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
                    ${index + 1}. ${pregunta.texto}
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

            test.opciones.forEach((opcion, optIndex) => {

                const optionId = `${test.id}_q${index}_o${optIndex}`;

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
                        name="pregunta_${pregunta.id}"
                        value="${opcion.valor}"
                        class="sr-only"
                        required
                    >
                    ${opcion.etiqueta}
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

                const respuestas = test.preguntas.map(pregunta => ({

                    questionId: pregunta.id,

                    value: Number(data.get(`pregunta_${pregunta.id}`))

                }));

                const submitButton = form.querySelector("button[type=submit]");

                submitButton.disabled = true;

                try {

                    const resultado = await guardarResultado({

                        estudiante: session,

                        test,

                        respuestas

                    });

                    resultados.unshift(resultado);

                    closeModal();

                    mostrarResultado(resultado);

                    habilitaciones.forEach(h => {

                        if (h.testId === test.id) h.estado = "inactiva";

                    });

                    renderCatalogo();

                    renderHistorial();

                } catch (error) {

                    submitButton.disabled = false;

                    alert(`No se pudo enviar la prueba: ${error.message}`);

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

        const esCritico = resultado.criticos && resultado.criticos.length > 0;

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
                    ${esCritico ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}
                "
            >
                <i class="fa-solid fa-${resultado.icon} text-3xl"></i>
            </div>

            <div>
                <p class="text-sm text-slate-500">Resultado de</p>
                <h3 class="text-xl font-bold text-navy-900">${resultado.testNombre}</h3>
            </div>

            <p class="text-3xl font-bold text-navy-900">${resultado.puntaje} / ${resultado.puntajeMax}</p>

        `;

        content.appendChild(

            Badge({ text: resultado.clasificacion, variant: resultado.variant })

        );

        const recomendacion = document.createElement("p");

        recomendacion.className = "max-w-sm text-sm leading-6 text-slate-500";

        recomendacion.textContent = resultado.recomendacion;

        content.appendChild(recomendacion);

        if (esCritico) {

            const aviso = document.createElement("p");

            aviso.className = "max-w-sm text-sm font-semibold leading-6 text-red-600";

            aviso.textContent = "Hemos notificado a tu psicólogo/a de orientación para que pueda acompañarte pronto. No estás solo/a: si necesitas hablar con alguien ahora mismo, ve a la sección de Ayuda.";

            content.appendChild(aviso);

        }

        const irAyuda = Button({

            text: "Ir a Ayuda",

            icon: "hand-holding-heart",

            variant: esCritico ? "danger" : "secondary",

            size: "sm",

            onClick() {

                closeModal();

                navigate("/estudiante/ayuda");

            }

        });

        content.appendChild(irAyuda);

        openModal(

            Modal({

                title: "Prueba completada",

                size: "sm",

                content

            })

        );

    }
    return DashboardLayout({

        activePath: "/estudiante/tamizaje",

        title: "Tamizaje Psicológico",

        content: page

    });

}
