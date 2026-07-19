// ======================================================
// InstitucionForm.js
// Barranquilla Convive
// ======================================================

export function InstitucionForm({

    institucion = null,

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
                    Código
                </label>

                <input

                    name="codigo"

                    type="text"

                    value="${institucion?.codigo ?? ""}"

                    placeholder="Ej: IED-4521"

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
                    Nombre de la institución
                </label>

                <input

                    name="nombre"

                    type="text"

                    value="${institucion?.nombre ?? ""}"

                    placeholder="Nombre de la institución"

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
                Dirección
            </label>

            <input

                name="direccion"

                type="text"

                value="${institucion?.direccion ?? ""}"

                placeholder="Dirección de la institución"

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
                    Localidad
                </label>

                <input

                    name="localidad"

                    type="text"

                    value="${institucion?.localidad ?? ""}"

                    placeholder="Ej: Riomar"

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
                    Teléfono
                </label>

                <input

                    name="telefono"

                    type="text"

                    value="${institucion?.telefono ?? ""}"

                    placeholder="Teléfono de contacto"

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

                Guardar Institución

            </button>

        </div>

    `;

    //=========================================
    // Cancelar
    //=========================================

    form.querySelector("#cancelButton").addEventListener(

        "click",

        () => {

            if (onCancel) {

                onCancel();

            }

        }

    );

    //=========================================
    // Submit
    //=========================================

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
