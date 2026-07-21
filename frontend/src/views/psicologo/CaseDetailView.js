import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { Card } from "../../components/ui/Card.js";
import { Badge } from "../../components/ui/Badge.js";
import { Avatar } from "../../components/ui/Avatar.js";
import { getParams, navigate } from "../../router.js";
import { getAlertaById, updateAlertaEstado } from "../../services/AlertaService.js";
import { getUserById } from "../../services/UserService.js";
import { getInstitucionById } from "../../services/InstitucionService.js";
import { getCursos } from "../../services/CursoService.js";
import {
    getSeguimientosByAlerta,
    createSeguimiento
} from "../../services/SeguimientoService.js";
import { getSession } from "../../session.js";

import { openSeguimientoModal } from "./SeguimientoModal.js";

const NIVEL_LABEL = {

    alto: "Alto",

    medio: "Medio",

    bajo: "Bajo"

};

const ESTADO_LABEL = {

    pendiente: "Pendiente de evaluación",

    "en seguimiento": "En seguimiento",

    resuelto: "Resuelto"

};

const ESTADO_VARIANT = {

    pendiente: "warning",

    "en seguimiento": "info",

    resuelto: "success"

};

export async function CaseDetailView() {

    const { id } = getParams();

    const [alerta, cursos] = await Promise.all([

        getAlertaById(id).catch(() => null),

        getCursos().catch(() => [])

    ]);

    if (!alerta) {

        return renderNoEncontrado();

    }

    const [estudiante, institucion, seguimientos] = await Promise.all([

        getUserById(alerta.estudianteId).catch(() => null),

        getInstitucionById(alerta.institucionId).catch(() => null),

        getSeguimientosByAlerta(alerta.id).catch(() => [])

    ]);

    const curso = cursos.find(c => c.id === alerta.cursoId);

    const estudianteNombre = estudiante
        ? `${estudiante.nombre} ${estudiante.apellido}`
        : "Estudiante no disponible";

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;
    const header = document.createElement("section");
    header.className = `
        flex
        flex-col
        gap-6
        rounded-3xl
        bg-white
        p-8
        shadow-sm
        lg:flex-row
        lg:items-center
        lg:justify-between
    `;
    const headerInfo = document.createElement("div");
    headerInfo.className = `
        flex
        items-center
        gap-5
    `;
    const avatar = Avatar({

        name: estudianteNombre,

        size: "xl"
    });
    const headerText = document.createElement("div");
    headerText.innerHTML = `
        <p class="text-sm font-medium text-slate-400">
            Caso #${alerta.id}
        </p>
        <h1 class="mt-1 text-2xl font-bold text-navy-900">
            ${estudianteNombre}
        </h1>
        <p class="mt-2 text-sm text-slate-500">
            ${institucion?.nombre ?? "Institución no disponible"} · ${curso?.nombre ?? "—"} · Alerta registrada el ${alerta.fecha}
        </p>
    `;
    headerInfo.append(
        avatar,
        headerText
    );
    const headerBadge = document.createElement("div");
    headerBadge.className = `
        flex
        items-center
        gap-3
    `;
    headerBadge.append(
        Badge({
            text: `Nivel: ${NIVEL_LABEL[alerta.nivelRiesgo] ?? alerta.nivelRiesgo}`,
            variant: alerta.nivelRiesgo === "alto" ? "danger" : (alerta.nivelRiesgo === "medio" ? "warning" : "success")
        })
    );
    header.append(
        headerInfo,
        headerBadge
    );
    page.appendChild(header);
    const grid = document.createElement("section");
    grid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;
    const infoBody = document.createElement("div");
    infoBody.className = `
        flex
        flex-col
        gap-6
    `;
    infoBody.innerHTML = `
        <p class="text-sm leading-7 text-slate-600">
            ${alerta.descripcion || "Sin descripción registrada."}
        </p>
        <div>
            <p class="text-sm font-medium text-slate-400">
                Estado actual
            </p>
        </div>
    `;
    infoBody.querySelector("div").appendChild(
        Badge({
            text: ESTADO_LABEL[alerta.estado] ?? alerta.estado,
            variant: ESTADO_VARIANT[alerta.estado] ?? "neutral"
        })
    );
    const infoContainer = document.createElement("div");
    infoContainer.className = "xl:col-span-2 flex flex-col gap-6";
    infoContainer.appendChild(
        Card({
            title: "Información del Caso",
            content: infoBody
        })
    );
    const historialBody = document.createElement("div");
    historialBody.innerHTML = seguimientos.length
        ? `
            <ul class="flex flex-col gap-4">

                ${seguimientos.map(seguimiento => `

                    <li
                        class="
                            rounded-2xl
                            border
                            border-slate-200
                            p-4
                        "
                    >
                        <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            ${seguimiento.fecha}
                        </p>
                        <p class="mt-2 text-sm leading-6 text-slate-700">
                            ${seguimiento.comentario}
                        </p>
                    </li>
                `).join("")}
            </ul>
        `
        : `
            <p class="text-sm text-slate-400">
                Aún no se han registrado seguimientos para este caso.
            </p>
        `;
    infoContainer.appendChild(
        Card({
            title: "Historial de Seguimiento",
            content: historialBody
        })
    );
    grid.appendChild(infoContainer);


    const accionesBody = document.createElement("div");

    accionesBody.className = `
        flex
        flex-col
        gap-3
    `;

    const agregarObservacion = document.createElement("button");

    agregarObservacion.type = "button";

    agregarObservacion.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-slate-700
        transition
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
    `;

    agregarObservacion.innerHTML = `
        <i class="fa-solid fa-note-sticky w-5 text-center"></i>
        <span>Agregar observación</span>
    `;

    agregarObservacion.addEventListener("click", () => {

        const session = getSession() || {};

        openSeguimientoModal({

            alertaId: alerta.id,

            async onSave({ comentario }) {

                await createSeguimiento({

                    alertaId: alerta.id,

                    usuarioId: session.id,

                    comentario,

                    fecha: new Date().toISOString().slice(0, 10)

                });

                if (alerta.estado === "pendiente") {

                    await updateAlertaEstado(alerta.id, "en seguimiento");

                }

                navigate(`/psicologo/casos/${alerta.id}`);

            }

        });

    });

    const programarSeguimiento = document.createElement("button");

    programarSeguimiento.type = "button";

    programarSeguimiento.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-slate-700
        transition
        hover:border-yellow-200
        hover:bg-yellow-50
        hover:text-yellow-700
    `;

    programarSeguimiento.innerHTML = `
        <i class="fa-solid fa-calendar-plus w-5 text-center"></i>
        <span>Programar seguimiento</span>
    `;

    programarSeguimiento.addEventListener("click", () => {

        navigate("/psicologo/agenda");

    });

    const cerrarCaso = document.createElement("button");

    cerrarCaso.type = "button";

    cerrarCaso.className = `
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-red-200
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-red-600
        transition
        hover:bg-red-50

        disabled:cursor-not-allowed
        disabled:opacity-50
    `;

    cerrarCaso.disabled = alerta.estado === "resuelto";

    cerrarCaso.innerHTML = `
        <i class="fa-solid fa-circle-check w-5 text-center"></i>
        <span>${alerta.estado === "resuelto" ? "Caso ya resuelto" : "Cerrar caso"}</span>
    `;

    cerrarCaso.addEventListener("click", async () => {

        if (!confirm("¿Confirmas que deseas marcar este caso como resuelto?")) {

            return;

        }

        await updateAlertaEstado(alerta.id, "resuelto");

        navigate(`/psicologo/casos/${alerta.id}`);

    });

    accionesBody.append(

        agregarObservacion,

        programarSeguimiento,

        cerrarCaso

    );

    grid.appendChild(

        Card({

            title: "Acciones",

            content: accionesBody

        })

    );

    page.appendChild(grid);
    return DashboardLayout({
        activePath: "/psicologo/casos",
        title: `Caso #${alerta.id}`,
        content: page
    });
}


function renderNoEncontrado() {

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        items-center
        gap-4
        rounded-3xl
        bg-white
        p-16
        text-center
        shadow-sm
    `;

    page.innerHTML = `

        <i class="fa-solid fa-folder-open text-5xl text-slate-300"></i>

        <h1 class="text-xl font-bold text-navy-900">
            Caso no encontrado
        </h1>

        <p class="text-sm text-slate-500">
            El caso que buscas no existe o ya no está disponible.
        </p>

    `;

    return DashboardLayout({

        activePath: "/psicologo/casos",

        title: "Caso no encontrado",

        content: page

    });

}
