// ======================================================
// UserFilters.js
// Barranquilla Convive
// ======================================================

export function UserFilters({

    onSearch = () => {},

    onRole = () => {},

    onStatus = () => {}

} = {}) {

    const container = document.createElement("div");

    container.className = `
        mb-6
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
    `;

    //=================================================
    // Buscador
    //=================================================

    const search = document.createElement("div");

    search.className = `
        relative
        w-full
        lg:w-96
    `;

    search.innerHTML = `

        <i
            class="
                fa-solid
                fa-magnifying-glass
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
            "
        ></i>

        <input

            type="text"

            placeholder="Buscar usuario..."

            class="
                w-full
                rounded-xl
                border
                border-slate-200
                py-3
                pl-11
                pr-4
                outline-none
                focus:border-yellow-400
            "

        >

    `;

    search.querySelector("input").addEventListener(

        "input",

        e => onSearch(e.target.value)

    );

    //=================================================
    // Filtros
    //=================================================

    const filters = document.createElement("div");

    filters.className = `
        flex
        gap-3
    `;

    // Rol

    const role = document.createElement("select");

    role.className = `
        rounded-xl
        border
        border-slate-200
        px-4
        py-3
    `;

    role.innerHTML = `

        <option value="">Todos los roles</option>

        <option value="admin">Administrador</option>

        <option value="docente">Docente</option>

        <option value="psicologo">Psicólogo</option>

        <option value="estudiante">Estudiante</option>

    `;

    role.addEventListener(

        "change",

        e => onRole(e.target.value)

    );

    // Estado

    const status = document.createElement("select");

    status.className = role.className;

    status.innerHTML = `

        <option value="">Todos los estados</option>

        <option value="activo">Activo</option>

        <option value="pendiente">Pendiente</option>

        <option value="inactivo">Inactivo</option>

    `;

    status.addEventListener(

        "change",

        e => onStatus(e.target.value)

    );

    filters.append(

        role,

        status

    );

    container.append(

        search,

        filters

    );

    return container;

}