export function AlertaForm({

    estudiantes = [],

    onSubmit = null,

    onCancel = null

} = {}) {

    const form = document.createElement("form");

    form.className = `
        grid
        gap-6
    `;

    form.innerHTML = `

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
                Estudiante
            </label>

            <select

                name="estudianteId"

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

                required

            >

                <option value="">Selecciona un estudiante</option>

                ${estudiantes.map(estudiante => `
                    <option value="${estudiante.id}">
                        ${estudiante.nombre} ${estudiante.apellido}
                    </option>
                `).join("")}

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
                Nivel de riesgo
            </label>

            <select

                name="nivelRiesgo"

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

                required

            >

                <option value="bajo">Bajo</option>

                <option value="medio">Medio</option>

                <option value="alto">Alto</option>

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
                Descripción
            </label>

            <textarea

                name="descripcion"

                rows="4"

                placeholder="Describe la situación observada..."

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

                required

            ></textarea>

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

                <i class="fa-solid fa-circle-exclamation mr-2"></i>

                Registrar Alerta

            </button>

        </div>

    `;

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

            if (onSubmit) {

                onSubmit(data);

            }

        }

    );

    return form;

}
