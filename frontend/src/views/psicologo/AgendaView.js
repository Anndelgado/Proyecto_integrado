import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";
import { Modal } from "../../components/ui/Modal.js";
import { Button } from "../../components/ui/Button.js";
import { openModal, closeModal } from "../../utils/modal.js";
import { getSession } from "../../session.js";
import { getAlertas } from "../../services/AlertaService.js";
import { getUsers } from "../../services/UserService.js";
import { getCitas, createCita, deleteCita } from "../../services/CitaService.js";
function hoyISO() {

    return new Date().toISOString().slice(0, 10);

}

const TIPO_VARIANT = {

    Entrevista: "info",

    Seguimiento: "warning",

    Reunión: "success"

};

export async function AgendaView() {

    const session = getSession() || {};

    const [alertasTodas, usuarios, citasIniciales] = await Promise.all([

        getAlertas().catch(() => []),

        getUsers().catch(() => []),

        getCitas(session.id).catch(() => [])

    ]);
    let citas = citasIniciales;

    const casos = alertasTodas.filter(

        alerta => alerta.institucionId === session.institucionId

    );

    const usuariosPorId = usuarios.reduce((acc, usuario) => {

        acc[usuario.id] = usuario;

        return acc;

    }, {});

    const estudiantesConCaso = casos.map(caso => usuariosPorId[caso.estudianteId]).filter(Boolean);

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    page.appendChild(

        PageHeader({

            title: "Agenda",

            subtitle: "Organiza tus citas, entrevistas y sesiones de seguimiento con los estudiantes.",

            icon: "calendar-days",

            buttonText: "Programar Cita",

            buttonIcon: "calendar-plus",

            onButtonClick() {

                abrirModalCita();

            },

            stats: [

                { label: "Citas hoy", value: citas.filter(c => c.fecha === hoyISO()).length },

                { label: "Citas programadas", value: citas.length }

            ]

        })

    );
    const listContainer = document.createElement("div");
    listContainer.className = `
        flex
        flex-col
        gap-6
    `;

    page.appendChild(listContainer);

    function renderLista() {

        listContainer.innerHTML = "";

        if (!citas.length) {

            listContainer.appendChild(

                Card({

                    content: mensajeVacio()

                })

            );

            return;

        }

        const citasPorFecha = [...citas]
            .sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
            .reduce((acc, cita) => {

                acc[cita.fecha] = acc[cita.fecha] ?? [];

                acc[cita.fecha].push(cita);

                return acc;

            }, {});

        Object.entries(citasPorFecha).forEach(([fecha, citasDelDia]) => {

            const body = document.createElement("div");

            body.className = `
                flex
                flex-col
                divide-y
                divide-slate-100
            `;

            citasDelDia.forEach(cita => {

                body.appendChild(filaCita(cita));

            });

            listContainer.appendChild(

                Card({

                    title: formatearFecha(fecha),

                    subtitle: `${citasDelDia.length} actividad(es) programada(s)`,

                    content: body

                })

            );

        });

    }

    function filaCita(cita) {

        const row = document.createElement("div");

        row.className = `
            flex
            flex-col
            gap-3
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
        `;

        const info = document.createElement("div");

        info.className = `
            flex
            items-center
            gap-4
        `;

        info.innerHTML = `

            <div
                class="
                    flex
                    h-12
                    w-16
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-50
                    text-sm
                    font-semibold
                    text-navy-900
                "
            >
                ${cita.hora}
            </div>

            <div>

                <p class="font-semibold text-navy-900">
                    ${cita.titulo}
                </p>

                <p class="mt-1 text-sm text-slate-500">
                    ${cita.estudiante ?? "Sin estudiante asociado"}
                </p>

            </div>

        `;
        const acciones = document.createElement("div");
        acciones.className = `
            flex
            items-center
            gap-3
        `;
        acciones.appendChild(

            Badge({

                text: cita.tipo,

                variant: TIPO_VARIANT[cita.tipo] ?? "neutral"

            })

        );

        const eliminarBtn = document.createElement("button");

        eliminarBtn.type = "button";

        eliminarBtn.className = `
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            hover:bg-red-50
            hover:text-red-600
        `;

        eliminarBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        eliminarBtn.addEventListener("click", async () => {

            eliminarBtn.disabled = true;

            try {

                await deleteCita(cita.id);

                citas = citas.filter(c => c.id !== cita.id);

                renderLista();

            } catch (error) {

                eliminarBtn.disabled = false;

                alert("No se pudo eliminar la cita. Intenta de nuevo.");

            }

        });

        acciones.appendChild(eliminarBtn);

        row.append(

            info,

            acciones

        );

        return row;

    }

    function mensajeVacio() {

        const wrapper = document.createElement("div");

        wrapper.className = `
            flex
            flex-col
            items-center
            gap-4
            py-12
            text-center
            text-slate-400
        `;

        wrapper.innerHTML = `

            <i class="fa-solid fa-calendar-days text-5xl"></i>

            <p>No tienes citas programadas por ahora.</p>

        `;

        return wrapper;
    }
    function abrirModalCita() {

        const form = document.createElement("form");

        form.className = `
            flex
            flex-col
            gap-6
        `;

        form.innerHTML = `

            <div>

                <label class="mb-2 block text-sm font-semibold text-slate-700">
                    Título
                </label>

                <input
                    name="titulo"
                    required
                    placeholder="Ej: Sesión de seguimiento"
                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "
                >

            </div>

            <div class="grid gap-6 md:grid-cols-2">

                <div>

                    <label class="mb-2 block text-sm font-semibold text-slate-700">
                        Fecha
                    </label>

                    <input
                        name="fecha"
                        type="date"
                        required
                        value="${hoyISO()}"
                        class="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            focus:border-yellow-400
                        "
                    >

                </div>

                <div>

                    <label class="mb-2 block text-sm font-semibold text-slate-700">
                        Hora
                    </label>

                    <input
                        name="hora"
                        type="time"
                        required
                        value="08:00"
                        class="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            focus:border-yellow-400
                        "
                    >

                </div>

            </div>

            <div>

                <label class="mb-2 block text-sm font-semibold text-slate-700">
                    Tipo de actividad
                </label>

                <select
                    name="tipo"
                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "
                >
                    <option value="Entrevista">Entrevista</option>
                    <option value="Seguimiento">Seguimiento</option>
                    <option value="Reunión">Reunión</option>
                </select>

            </div>

            <div>

                <label class="mb-2 block text-sm font-semibold text-slate-700">
                    Estudiante (opcional)
                </label>

                <select
                    name="estudiante"
                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "
                >
                    <option value="">Sin asociar</option>
                    ${estudiantesConCaso.map(estudiante => `
                        <option value="${estudiante.nombre} ${estudiante.apellido}">
                            ${estudiante.nombre} ${estudiante.apellido}
                        </option>
                    `).join("")}
                </select>

            </div>

            <div
                class="
                    flex
                    justify-end
                    gap-3
                    border-t
                    border-slate-200
                    pt-4
                "
            >

            </div>

        `;
        form.lastElementChild.append(

            Button({

                text: "Cancelar",

                variant: "secondary",

                onClick: closeModal

            }),

            Button({

                text: "Guardar cita",

                icon: "floppy-disk",

                type: "submit"

            })

        );

        form.addEventListener(

            "submit",

            async (event) => {

                event.preventDefault();

                const submitBtn = form.querySelector("button[type=submit]");

                if (submitBtn) submitBtn.disabled = true;

                const data = Object.fromEntries(new FormData(form).entries());

                try {

                    const nuevaCita = await createCita({

                        psicologoId: session.id,

                        titulo: data.titulo,

                        fecha: data.fecha,

                        hora: data.hora,

                        tipo: data.tipo,

                        estudiante: data.estudiante || null

                    });

                    citas.push(nuevaCita);

                    closeModal();

                    renderLista();

                } catch (error) {

                    if (submitBtn) submitBtn.disabled = false;

                    alert("No se pudo guardar la cita. Intenta de nuevo.");

                }

            }

        );

        openModal(

            Modal({

                title: "Programar Cita",

                content: form,

                onClose: closeModal

            })

        );

    }

    renderLista();
    return DashboardLayout({

        activePath: "/psicologo/agenda",

        title: "Agenda",

        content: page

    });

}
function formatearFecha(iso) {

    const fecha = new Date(`${iso}T00:00:00`);

    const texto = fecha.toLocaleDateString("es-CO", {

        weekday: "long",

        day: "numeric",

        month: "long"

    });

    return texto.charAt(0).toUpperCase() + texto.slice(1);

}
