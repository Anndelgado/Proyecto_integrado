import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";
import { getSession } from "../../session.js";
import { getUsers } from "../../services/UserService.js";
import {
    getCatalogoTamizajes,
    getHabilitaciones,
    getResultados,
    habilitarTamizaje,
    revocarHabilitacion
} from "../../services/TamizajeService.js";

export async function HabilitacionesView() {

    const session = getSession() || {};

    const catalogo = getCatalogoTamizajes();

    const [usuarios, habilitacionesTodas, resultadosTodos] = await Promise.all([

        getUsers().catch(() => []),

        getHabilitaciones().catch(() => []),

        getResultados().catch(() => [])

    ]);

    // Solo estudiantes activos de la misma institución que el docente.
    const estudiantes = usuarios.filter(
        u => u.rol === "estudiante" && u.institucionId === session.institucionId && u.estado === "activo"
    );

    const estudiantesPorId = estudiantes.reduce((acc, estudiante) => {

        acc[estudiante.id] = estudiante;

        return acc;

    }, {});

    // Habilitaciones/resultados de estudiantes de esta institución.
    const habilitaciones = habilitacionesTodas.filter(h => estudiantesPorId[h.estudianteId]);

    const resultados = resultadosTodos.filter(r => estudiantesPorId[r.estudianteId]);

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Tamizaje Psicológico",

            subtitle: "Como docente, habilita las pruebas de tamizaje que cada estudiante puede presentar y revisa los resultados obtenidos.",

            icon: "clipboard-check",

            stats: [

                { label: "Estudiantes", value: estudiantes.length },

                { label: "Habilitaciones activas", value: habilitaciones.filter(h => h.estado === "activa").length },

                { label: "Pruebas respondidas", value: resultados.length },

                { label: "Resultados en riesgo alto", value: resultados.filter(r => r.nivel === "Alto").length }

            ]

        })

    );

    const form = document.createElement("form");

    form.className = `
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-end
    `;

    form.innerHTML = `

        <div class="flex-1">
            <label class="mb-1 block text-sm font-medium text-slate-600">Estudiante</label>
            <select
                name="estudianteId"
                required
                class="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
                <option value="" disabled selected>Selecciona un estudiante</option>
                ${estudiantes.map(e => `<option value="${e.id}">${e.nombre} ${e.apellido} · ${e.documento}</option>`).join("")}
            </select>
        </div>

        <div class="flex-1">
            <label class="mb-1 block text-sm font-medium text-slate-600">Prueba</label>
            <select
                name="testId"
                required
                class="w-full rounded-xl border border-slate-200 px-4 py-3"
            >
                <option value="" disabled selected>Selecciona una prueba</option>
                ${catalogo.map(t => `<option value="${t.id}">${t.nombre}</option>`).join("")}
            </select>
        </div>

    `;

    const submitWrapper = document.createElement("div");

    submitWrapper.appendChild(

        Button({

            text: "Habilitar prueba",

            icon: "unlock",

            type: "submit"

        })

    );

    form.appendChild(submitWrapper);

    const feedback = document.createElement("p");

    feedback.className = "text-sm";

    page.appendChild(

        Card({

            title: "Habilitar una prueba",

            subtitle: "El estudiante seleccionado podrá responder la prueba elegida hasta que la envíe.",

            content: (() => {

                const wrapper = document.createElement("div");

                wrapper.className = "flex flex-col gap-4";

                wrapper.append(form, feedback);

                return wrapper;

            })()

        })

    );

    form.addEventListener(

        "submit",

        async (event) => {

            event.preventDefault();

            const data = new FormData(form);

            const estudianteId = Number(data.get("estudianteId"));

            const testId = data.get("testId");

            const submitButton = form.querySelector("button[type=submit]");

            submitButton.disabled = true;

            feedback.textContent = "";

            try {

                await habilitarTamizaje({

                    estudianteId,

                    testId,

                    psicologoId: session.id

                });

                const test = catalogo.find(t => t.id === testId);

                const estudiante = estudiantesPorId[estudianteId];

                habilitaciones.unshift({

                    id: `nueva-${Date.now()}`,

                    estudianteId,

                    testId,

                    testNombre: test.nombre,

                    psicologoId: session.id,

                    fecha: new Date().toISOString().slice(0, 10),

                    estado: "activa"

                });

                feedback.className = "text-sm text-emerald-600";

                feedback.textContent = `Prueba "${test.nombre}" habilitada para ${estudiante.nombre} ${estudiante.apellido}.`;

                form.reset();

                renderHabilitaciones();

            } catch (error) {

                feedback.className = "text-sm text-red-600";

                feedback.textContent = `No se pudo habilitar la prueba: ${error.message}`;

            } finally {

                submitButton.disabled = false;

            }

        }

    );
    const habilitacionesContainer = document.createElement("div");
    page.appendChild(habilitacionesContainer);
    function renderHabilitaciones() {

        habilitacionesContainer.innerHTML = "";

        habilitacionesContainer.appendChild(

            TableCard({

                title: "Habilitaciones",

                subtitle: "Historial de pruebas habilitadas para tus estudiantes",

                headers: [

                    "Estudiante",

                    "Prueba",

                    "Fecha",

                    "Estado",

                    ""

                ],

                rows: habilitaciones.map(h => {

                    const estudiante = estudiantesPorId[h.estudianteId];

                    const nombre = estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : `Estudiante #${h.estudianteId}`;

                    const acciones = document.createElement("div");

                    if (h.estado === "activa") {

                        acciones.appendChild(

                            Button({

                                text: "Revocar",

                                icon: "ban",

                                variant: "ghost",

                                size: "sm",

                                async onClick() {

                                    try {

                                        await revocarHabilitacion(h.id);

                                        h.estado = "inactiva";

                                        renderHabilitaciones();

                                    } catch (error) {

                                        alert(`No se pudo revocar: ${error.message}`);

                                    }

                                }

                            })

                        );

                    }

                    return [

                        nombre,

                        h.testNombre,

                        h.fecha,

                        Badge({

                            text: h.estado === "activa" ? "Activa" : "Inactiva",

                            variant: h.estado === "activa" ? "success" : "neutral"

                        }),

                        acciones

                    ];

                }),

                emptyMessage: "Aún no has habilitado ninguna prueba de tamizaje."

            })

        );

    }

    renderHabilitaciones();
    page.appendChild(

        TableCard({

            title: "Resultados Recientes",

            subtitle: "Últimas pruebas de tamizaje respondidas por tus estudiantes",

            headers: [

                "Estudiante",

                "Prueba",

                "Fecha",

                "Puntaje",

                "Clasificación"

            ],

            rows: resultados.slice(0, 10).map(r => {

                const estudiante = estudiantesPorId[r.estudianteId];

                const nombre = estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : `Estudiante #${r.estudianteId}`;

                return [

                    nombre,

                    r.testNombre,

                    r.fecha,

                    `${r.puntaje}/${r.puntajeMax}`,

                    Badge({ text: r.clasificacion, variant: r.variant })

                ];

            }),

            emptyMessage: "Todavía no hay resultados de tamizaje registrados."

        })

    );
    return DashboardLayout({

        activePath: "/docente/tamizaje",

        title: "Tamizaje Psicológico",

        content: page

    });

}
