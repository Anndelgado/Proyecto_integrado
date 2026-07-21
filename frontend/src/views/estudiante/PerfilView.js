import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { Avatar } from "../../components/ui/Avatar.js";
import { Button } from "../../components/ui/Button.js";
import { getSession, setSession } from "../../session.js";
import { updateUser } from "../../services/UserService.js";
import { getInstituciones } from "../../services/InstitucionService.js";
import { getCursos } from "../../services/CursoService.js";

export async function PerfilView() {

    const session = getSession() || {};

    const [instituciones, cursos] = await Promise.all([

        getInstituciones().catch(() => []),

        getCursos().catch(() => [])

    ]);

    const institucion = instituciones.find(

        i => i.id === session.institucionId

    );

    const curso = cursos.find(

        c => c.id === session.cursoId

    );

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    page.appendChild(

        PageHeader({

            title: "Mi Perfil",

            subtitle: "Consulta y actualiza tu información personal.",

            icon: "circle-user"

        })

    );

    const grid = document.createElement("section");

    grid.className = `
        grid
        gap-6
        xl:grid-cols-3
    `;
    const identityBody = document.createElement("div");

    identityBody.className = `
        flex
        flex-col
        items-center
        gap-4
        text-center
    `;

    identityBody.appendChild(

        Avatar({

            name: session.nombre ?? "Estudiante",

            size: "xl"

        })

    );

    identityBody.innerHTML += `

        <div>

            <h3 class="text-xl font-bold text-navy-900">

                ${session.nombre ?? ""} ${session.apellido ?? ""}

            </h3>

            <p class="mt-1 text-sm text-slate-500">

                Estudiante ${curso ? `· ${curso.nombre}` : ""}

            </p>

        </div>

        <div
            class="
                w-full
                rounded-2xl
                bg-slate-50
                p-4
                text-left
                text-sm
                text-slate-600
            "
        >

            <p class="flex items-center gap-2">

                <i class="fa-solid fa-school text-slate-400"></i>

                ${institucion?.nombre ?? "Institución no asignada"}

            </p>

            <p class="mt-2 flex items-center gap-2">

                <i class="fa-solid fa-chalkboard text-slate-400"></i>

                ${curso?.nombre ?? "Curso no asignado"}

            </p>

            <p class="mt-2 flex items-center gap-2">

                <i class="fa-solid fa-envelope text-slate-400"></i>

                ${session.correo ?? ""}

            </p>

        </div>

    `;

    grid.appendChild(

        Card({

            content: identityBody

        })

    );
    const formWrapper = document.createElement("div");

    formWrapper.className = "xl:col-span-2";

    const form = document.createElement("form");

    form.className = `
        grid
        gap-6
    `;

    form.innerHTML = `

        <div class="grid gap-6 md:grid-cols-2">

            ${field("Nombre", "nombre", session.nombre)}

            ${field("Apellido", "apellido", session.apellido)}

        </div>

        <div class="grid gap-6 md:grid-cols-2">

            ${field("Correo", "correo", session.correo, "email")}

            ${field("Teléfono", "telefono", session.telefono)}

        </div>

        ${field("Documento", "documento", session.documento, "text", true)}

        <div
            class="
                flex
                justify-end
                pt-4
                border-t
                border-slate-200
            "
        >

        </div>

    `;

    const saveButton = Button({

        text: "Guardar cambios",

        icon: "floppy-disk",

        type: "submit"

    });

    form.lastElementChild.appendChild(saveButton);

    form.addEventListener(

        "submit",

        async (event) => {

            event.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());

            const actualizado = {

                ...session,

                ...data

            };

            await updateUser(session.id, actualizado);

            setSession(actualizado);

            alert("Tu perfil se actualizó correctamente.");

        }

    );

    formWrapper.appendChild(

        Card({

            title: "Información Personal",

            subtitle: "Estos datos son visibles para tu docente y el equipo de orientación",

            content: form

        })

    );

    grid.appendChild(formWrapper);

    page.appendChild(grid);


    return DashboardLayout({

        activePath: "/estudiante/perfil",

        title: "Mi Perfil",

        content: page

    });

}


function field(label, name, value = "", type = "text", disabled = false) {

    return `

        <div>

            <label
                class="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                "
            >
                ${label}
            </label>

            <input

                name="${name}"

                type="${type}"

                value="${value ?? ""}"

                ${disabled ? "disabled" : ""}

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-yellow-400
                    disabled:bg-slate-100
                    disabled:text-slate-400
                "

            >

        </div>

    `;

}
