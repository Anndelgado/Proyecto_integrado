import { Button } from "../ui/Button.js";
import { getCursos } from "../../services/CursoService.js";

export function UserForm({

    user = null,

    onSubmit = null,

    onCancel = null

} = {}) {

    const form = document.createElement("form");

    form.className = `
        grid
        gap-6
    `;

    form.innerHTML = `

        <div class="grid gap-6 md:grid-cols-2">

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
                    Documento
                </label>

                <input

                    name="documento"

                    type="text"

                    value="${user?.documento ?? ""}"

                    placeholder="Número de documento"

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

                    required

                >

            </div>

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
                    Nombre completo
                </label>

                <input

                    name="nombre"

                    type="text"

                    value="${user?.nombre ?? ""}"

                    placeholder="Nombre completo"

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

                    required

                >

            </div>

        </div>

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
                Correo institucional
            </label>

            <input

                name="correo"

                type="email"

                value="${user?.correo ?? ""}"

                placeholder="correo@institucion.edu.co"

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

                required

            >

        </div>

        <div class="grid gap-6 md:grid-cols-2">

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
                    Contraseña
                </label>

                <input

                    name="password"

                    type="password"

                    placeholder="********"

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

                    ${user ? "" : "required"}

                >

            </div>

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
                    Confirmar contraseña
                </label>

                <input

                    name="confirmPassword"

                    type="password"

                    placeholder="********"

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

                    ${user ? "" : "required"}

                >

            </div>

        </div>

                <div class="grid gap-6 md:grid-cols-3">

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
                    Rol
                </label>

                <select

                    name="rol"

                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "

                >

                    <option value="estudiante"
                        ${user?.rol === "estudiante" ? "selected" : ""}
                    >
                        Estudiante
                    </option>

                    <option value="docente"
                        ${user?.rol === "docente" ? "selected" : ""}
                    >
                        Docente
                    </option>

                    <option value="psicologo"
                        ${user?.rol === "psicologo" ? "selected" : ""}
                    >
                        Psicólogo
                    </option>

                    <option value="admin"
                        ${user?.rol === "admin" ? "selected" : ""}
                    >
                        Administrador
                    </option>

                </select>

            </div>

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
                    Estado
                </label>

                <select

                    name="estado"

                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "

                >

                    <option value="activo"
                        ${user?.estado === "activo" ? "selected" : ""}
                    >
                        Activo
                    </option>

                    <option value="pendiente"
                        ${user?.estado === "pendiente" ? "selected" : ""}
                    >
                        Pendiente
                    </option>

                    <option value="inactivo"
                        ${user?.estado === "inactivo" ? "selected" : ""}
                    >
                        Inactivo
                    </option>

                </select>

            </div>

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
                    Institución
                </label>

                <select

                    name="institucionId"

                    id="institucionField"

                    class="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        outline-none
                        focus:border-yellow-400
                    "

                >

                    <option value="">
                        Seleccionar institución
                    </option>

                    <option value="1"
                        ${String(user?.institucionId ?? "") === "1" ? "selected" : ""}
                    >
                        IED Simón Bolívar
                    </option>

                    <option value="2"
                        ${String(user?.institucionId ?? "") === "2" ? "selected" : ""}
                    >
                        IED Karl Parrish
                    </option>

                    <option value="3"
                        ${String(user?.institucionId ?? "") === "3" ? "selected" : ""}
                    >
                        IED La Salle
                    </option>

                </select>

            </div>

        </div>

        <div id="cursoWrapper" class="hidden">

            <label
                class="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                "
            >
                Curso
            </label>

            <select

                name="cursoId"

                id="cursoField"

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    outline-none
                    focus:border-yellow-400
                "

            >

                <option value="">
                    Seleccionar curso
                </option>

            </select>

        </div>

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
                Observaciones
            </label>

            <textarea

                name="observaciones"

                rows="4"

                placeholder="Observaciones del usuario..."

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    resize-none
                    focus:border-yellow-400
                "

            >${user?.observaciones ?? ""}</textarea>

        </div>

        <div
            class="
                flex
                justify-end
                gap-4
                pt-4
                border-t
                border-slate-200
            "
        >

            <button

                type="button"

                id="cancelButton"

                class="
                    rounded-xl
                    border
                    border-slate-200
                    px-6
                    py-3
                    font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-100
                "

            >

                Cancelar

            </button>

            <button

                type="submit"

                class="
                    rounded-xl
                    bg-yellow-400
                    px-6
                    py-3
                    font-semibold
                    text-navy-900
                    transition
                    hover:bg-yellow-300
                "

            >

                <i class="fa-solid fa-floppy-disk mr-2"></i>

                Guardar Usuario

            </button>

        </div>

    `;
    const rolSelect = form.querySelector("[name='rol']");

    const institucionSelect = form.querySelector("#institucionField");

    const cursoWrapper = form.querySelector("#cursoWrapper");

    const cursoSelect = form.querySelector("#cursoField");

    const ROLES_CON_CURSO = ["estudiante", "docente"];

    let cursosDisponibles = [];

    function rolNecesitaCurso() {

        return ROLES_CON_CURSO.includes(rolSelect.value);

    }

    function poblarCursos() {

        const institucionId = institucionSelect.value;

        const opciones = institucionId
            ? cursosDisponibles.filter(
                curso => String(curso.institucionId) === institucionId
            )
            : cursosDisponibles;

        cursoSelect.innerHTML = `
            <option value="">Seleccionar curso</option>
            ${opciones
                .map(
                    curso => `
                        <option value="${curso.id}"
                            ${String(user?.cursoId ?? "") === String(curso.id) ? "selected" : ""}
                        >
                            ${curso.nombre}
                        </option>
                    `
                )
                .join("")}
        `;

    }

    function actualizarVisibilidadCurso() {

        cursoWrapper.classList.toggle("hidden", !rolNecesitaCurso());

    }

    getCursos()
        .then(cursos => {

            cursosDisponibles = cursos;

            poblarCursos();

            actualizarVisibilidadCurso();

        })
        .catch(() => {

            cursosDisponibles = [];

        });

    rolSelect.addEventListener("change", actualizarVisibilidadCurso);
    institucionSelect.addEventListener("change", poblarCursos);

    form.querySelector("#cancelButton").addEventListener(

        "click",

        () => {

            if (onCancel) {

                onCancel();

            }

        }

    );

    form.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            const data = Object.fromEntries(

                new FormData(form).entries()

            );

            if (

                data.password ||

                data.confirmPassword

            ) {

                if (

                    data.password !==

                    data.confirmPassword

                ) {

                    alert(

                        "Las contraseñas no coinciden."

                    );

                    return;

                }

            }

            delete data.confirmPassword;

            if (!rolNecesitaCurso()) {

                data.cursoId = null;

            } else {

                data.cursoId = data.cursoId || null;

            }

            data.institucionId = data.institucionId || null;

            if (onSubmit) {

                onSubmit(data);

            }

        }

    );

    return form;

}