import { getSession, clearSession } from "../../session.js";
import { Avatar } from "../ui/Avatar.js";
import { navigate } from "../../router.js";
import { getRoleLabel } from "./navigation.js";
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from "../../services/NotificationService.js";

export function Topbar({

    title = "Dashboard",

    onMenuClick = null

} = {}) {

    const user = getSession() || {};

    const header = document.createElement("header");

    header.className = `
        sticky
        top-0
        z-20
        flex
        h-20
        items-center
        justify-between
        gap-4
        border-b
        border-slate-200
        bg-white
        px-4
        sm:px-8
    `;
    const left = document.createElement("div");

    left.className = `
        flex
        items-center
        gap-3
    `;

    if (onMenuClick) {

        const menuButton = document.createElement("button");

        menuButton.type = "button";

        menuButton.setAttribute("aria-label", "Abrir menú");

        menuButton.className = `
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-600
            transition
            hover:bg-slate-100
            lg:hidden
        `;

        menuButton.innerHTML = `<i class="fa-solid fa-bars text-lg"></i>`;

        menuButton.addEventListener("click", onMenuClick);

        left.appendChild(menuButton);

    }

    const titleWrapper = document.createElement("div");

    titleWrapper.className = `
        flex
        min-w-0
        flex-col
    `;

    titleWrapper.innerHTML = `
        <h1
            class="
                truncate
                text-xl
                font-bold
                text-navy-900
                sm:text-2xl
            "
        >
            ${title}
        </h1>
    `;

    left.appendChild(titleWrapper);
    const right = document.createElement("div");

    right.className = `
        flex
        items-center
        gap-5
    `;
    right.appendChild(
        createNotificationsMenu(user)
    );
    right.appendChild(
        createProfileMenu(user)
    );
    header.append(

        left,

        right

    );

    return header;

}
function createNotificationsMenu(user) {

    const wrapper = document.createElement("div");

    wrapper.className = "relative";

 
    const bell = document.createElement("button");
    bell.type = "button";
    bell.setAttribute("aria-haspopup", "true");
    bell.setAttribute("aria-expanded", "false");
    bell.className = `
        relative
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        transition
        hover:bg-yellow-100
    `;

    bell.innerHTML = `
        <i
            class="
                fa-regular
                fa-bell
                text-lg
                text-slate-600
            "
        ></i>
    `;
    const dot = document.createElement("span");
    dot.className = `
        absolute
        right-2
        top-2
        hidden
        h-2.5
        w-2.5
        rounded-full
        bg-red-500
        ring-2
        ring-white
    `;

    bell.appendChild(dot);
    const dropdown = document.createElement("div");
    dropdown.className = `
        fixed
        left-4
        right-4
        top-20
        z-30
        mt-0
        hidden
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-xl
        sm:absolute
        sm:left-auto
        sm:right-0
        sm:top-full
        sm:mt-2
        sm:w-96
    `;
    const dropdownHeader = document.createElement("div");
    dropdownHeader.className = `
        flex
        items-center
        justify-between
        border-b
        border-slate-100
        px-4
        py-3
    `;

    dropdownHeader.innerHTML = `
        <p class="text-sm font-semibold text-navy-900">
            Notificaciones
        </p>
    `;

    const markAllButton = document.createElement("button");

    markAllButton.type = "button";
    markAllButton.className = `
        hidden
        text-xs
        font-medium
        text-yellow-600
        transition-colors
        hover:text-yellow-700
    `;

    markAllButton.textContent = "Marcar todas como leídas";

    dropdownHeader.appendChild(markAllButton);

    const list = document.createElement("div");

    list.className = `
        max-h-96
        overflow-y-auto
        divide-y
        divide-slate-100
    `;

    list.innerHTML = renderLoadingState();

    dropdown.append(

        dropdownHeader,

        list

    );

    wrapper.append(

        bell,

        dropdown

    );
    let notifications = [];

    async function loadNotifications() {

        if (!user.id) {

            list.innerHTML = renderEmptyState();

            return;

        }

        try {

            notifications = await getNotifications(user.id);

            renderList();

        } catch (error) {

            console.error(error);

            list.innerHTML = renderErrorState();

        }

    }

    function hasUnread() {

        return notifications.some(n => !n.leida);

    }

    function updateBadge() {

        dot.classList.toggle("hidden", !hasUnread());

        markAllButton.classList.toggle("hidden", !hasUnread());

    }

    function renderList() {

        updateBadge();

        if (notifications.length === 0) {

            list.innerHTML = renderEmptyState();

            return;

        }

        list.innerHTML = "";

        notifications.forEach(notification => {

            list.appendChild(
                createNotificationItem(notification)
            );

        });

    }

    function createNotificationItem(notification) {

        const item = document.createElement("button");

        item.type = "button";

        item.className = `
            flex
            w-full
            items-start
            gap-3
            px-4
            py-3
            text-left
            transition-colors
            duration-150
            hover:bg-slate-50

            ${notification.leida ? "" : "bg-yellow-50/60"}
        `;

        item.innerHTML = `
            <span
                class="
                    mt-1.5
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    ${notification.leida ? "bg-transparent" : "bg-yellow-500"}
                "
            ></span>

            <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-navy-900">
                    ${notification.titulo}
                </p>

                <p class="mt-0.5 text-xs leading-relaxed text-slate-500">
                    ${notification.mensaje}
                </p>

                <p class="mt-1 text-[11px] text-slate-400">
                    ${formatDate(notification.fecha)}
                </p>
            </div>
        `;

        item.addEventListener("click", async () => {

            if (notification.leida) return;

            notification.leida = true;

            renderList();

            try {

                await markAsRead(notification.id);

            } catch (error) {

                console.error(error);

            }

        });

        return item;

    }

    markAllButton.addEventListener("click", async (event) => {

        event.stopPropagation();

        notifications.forEach(n => n.leida = true);

        renderList();

        try {

            await markAllAsRead(user.id);

        } catch (error) {

            console.error(error);

        }

    });

    loadNotifications();

    let isOpen = false;

    function openDropdown() {

        isOpen = true;

        dropdown.classList.remove("hidden");

        bell.setAttribute("aria-expanded", "true");

        document.addEventListener("click", onOutsideClick);

        document.addEventListener("keydown", onKeydown);

    }

    function closeDropdown() {

        isOpen = false;

        dropdown.classList.add("hidden");

        bell.setAttribute("aria-expanded", "false");

        document.removeEventListener("click", onOutsideClick);

        document.removeEventListener("keydown", onKeydown);

    }

    function onOutsideClick(event) {

        if (!wrapper.contains(event.target)) {

            closeDropdown();

        }

    }

    function onKeydown(event) {

        if (event.key === "Escape") {

            closeDropdown();

        }

    }

    bell.addEventListener("click", (event) => {

        event.stopPropagation();

        isOpen ? closeDropdown() : openDropdown();

    });

    return wrapper;

}

function renderEmptyState() {

    return `
        <div class="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <i class="fa-regular fa-bell-slash text-2xl text-slate-300"></i>
            <p class="text-sm text-slate-500">
                No tienes notificaciones.
            </p>
        </div>
    `;

}

function renderLoadingState() {

    return `
        <div class="flex items-center justify-center px-4 py-10">
            <i class="fa-solid fa-circle-notch fa-spin text-lg text-slate-300"></i>
        </div>
    `;

}

function renderErrorState() {

    return `
        <div class="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <i class="fa-solid fa-triangle-exclamation text-2xl text-slate-300"></i>
            <p class="text-sm text-slate-500">
                No se pudieron cargar las notificaciones.
            </p>
        </div>
    `;

}

function formatDate(fecha) {

    if (!fecha) return "";

    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("es-CO", {

        day: "numeric",

        month: "short",

        year: "numeric"

    });

}

function createProfileMenu(user) {

    const wrapper = document.createElement("div");

    wrapper.className = "relative";
    const profile = document.createElement("button");

    profile.type = "button";

    profile.setAttribute("aria-haspopup", "true");

    profile.setAttribute("aria-expanded", "false");

    profile.className = `
        flex
        items-center
        gap-3
        rounded-xl
        px-2
        py-2
        transition-all
        duration-200
        hover:bg-slate-100
    `;

    const avatar = Avatar({

        name: user.nombre || "Usuario",

        size: "md"

    });

    const info = document.createElement("div");

    info.className = `
        hidden
        text-left
        lg:block
    `;

    info.innerHTML = `
        <p
            class="
                text-sm
                font-semibold
                text-navy-900
            "
        >
            ${user.nombre || "Usuario"}
        </p>

        <p
            class="
                text-xs
                text-slate-500
                capitalize
            "
        >
            ${user.rol ? getRoleLabel(user.rol) : ""}
        </p>
    `;

    const arrow = document.createElement("i");

    arrow.className = `
        fa-solid
        fa-chevron-down
        hidden
        text-xs
        text-slate-400
        transition-transform
        duration-200
        lg:block
    `;

    profile.append(

        avatar,

        info,

        arrow

    );

    const dropdown = document.createElement("div");

    dropdown.className = `
        absolute
        right-0
        top-full
        z-30
        mt-2
        hidden
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-xl
    `;

    dropdown.innerHTML = `
        <div class="border-b border-slate-100 p-4">
            <p class="truncate text-sm font-semibold text-navy-900">
                ${user.nombre || "Usuario"}
            </p>

            <p class="truncate text-xs text-slate-500">
                ${user.correo || user.email || ""}
            </p>

            <span
                class="
                    mt-2
                    inline-block
                    rounded-full
                    bg-yellow-100
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    capitalize
                    text-navy-900
                "
            >
                ${user.rol ? getRoleLabel(user.rol) : "Usuario"}
            </span>
        </div>
    `;

    const logoutButton = document.createElement("button");

    logoutButton.type = "button";

    logoutButton.className = `
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-slate-600
        transition-colors
        duration-150
        hover:bg-red-50
        hover:text-red-600
    `;

    logoutButton.innerHTML = `
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Cerrar sesión</span>
    `;

    logoutButton.addEventListener("click", () => {

        closeDropdown();

        clearSession();

        navigate("/login");

    });

    dropdown.appendChild(logoutButton);

    wrapper.append(

        profile,

        dropdown

    );
    let isOpen = false;

    function openDropdown() {

        isOpen = true;

        dropdown.classList.remove("hidden");

        arrow.classList.add("rotate-180");

        profile.setAttribute("aria-expanded", "true");

        document.addEventListener("click", onOutsideClick);

        document.addEventListener("keydown", onKeydown);

    }

    function closeDropdown() {

        isOpen = false;

        dropdown.classList.add("hidden");

        arrow.classList.remove("rotate-180");

        profile.setAttribute("aria-expanded", "false");

        document.removeEventListener("click", onOutsideClick);

        document.removeEventListener("keydown", onKeydown);

    }

    function onOutsideClick(event) {

        if (!wrapper.contains(event.target)) {

            closeDropdown();

        }

    }

    function onKeydown(event) {

        if (event.key === "Escape") {

            closeDropdown();

        }

    }

    profile.addEventListener("click", (event) => {

        event.stopPropagation();

        isOpen ? closeDropdown() : openDropdown();

    });

    return wrapper;

}
