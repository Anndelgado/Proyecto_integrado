// ======================================================
// Sidebar.js
// Barranquilla Convive
// ======================================================

import { getSession } from "../../session.js";
import logo from "../../assets/logo-transparent.png";
import { getNavigation } from "./navigation.js";

function findActiveItem(items, currentPath) {

  let bestMatch = null;

  items.forEach(item => {

    const matches =
      currentPath === item.path ||
      currentPath.startsWith(`${item.path}/`);

    if (!matches) return;

    if (!bestMatch || item.path.length > bestMatch.path.length) {
      bestMatch = item;
    }

  });

  return bestMatch;

}

function createLogo() {
  const wrapper = document.createElement("div");

  wrapper.className = `
    flex
    h-20
    shrink-0
    items-center
    justify-center
    border-b
    border-slate-200
    px-6
  `;

  wrapper.innerHTML = `
    <a
      href="/"
      data-link
      class="transition hover:scale-105"
    >
      <img
        src="${logo}"
        alt="Barranquilla Convive"
        class="h-11 w-auto"
      >
    </a>
  `;

  return wrapper;
}

function createMenuItem(item, active) {

  const link = document.createElement("a");

  link.href = item.path;

  link.dataset.link = "";

  link.className = `
      group
      relative
      flex
      items-center
      gap-4
      rounded-xl
      px-4
      py-3
      text-sm
      font-medium
      transition-all
      duration-200

      ${
        active
          ? `
            bg-yellow-100
            text-navy-900
            shadow-sm
          `
          : `
            text-slate-600
            hover:bg-yellow-50
            hover:text-navy-900
          `
      }
  `;

  if (active) {

    const indicator = document.createElement("span");

    indicator.className = `
        absolute
        left-0
        top-2
        bottom-2
        w-1
        rounded-r-full
        bg-yellow-400
    `;

    link.appendChild(indicator);

  }

  const icon = document.createElement("i");

  icon.className = `
      fa-solid
      fa-${item.icon}
      w-5
      text-center
      transition

      ${
        active
          ? "text-yellow-500"
          : "text-slate-400 group-hover:text-yellow-500"
      }
  `;

  const text = document.createElement("span");

  text.className = "truncate";

  text.textContent = item.label;

  link.append(
    icon,
    text
  );

  return link;

}

function createMenu(role, activePath) {

  const menu = getNavigation(role);

  const activeItem = findActiveItem(menu.items, activePath);

  const nav = document.createElement("nav");

  nav.className = `
      flex-1
      space-y-2
      overflow-y-auto
      px-4
      py-6
  `;

  menu.items.forEach(item => {

      nav.appendChild(

          createMenuItem(

              item,

              item === activeItem

          )

      );

  });

  return nav;

}

// ======================================================
// Sidebar (versión escritorio, siempre visible en lg+)
// ======================================================

export function Sidebar({

    activePath = "/"

} = {}) {

    const user = getSession() || {};

    const rol = user.rol || "estudiante";

  const sidebar = document.createElement("aside");

  sidebar.className = `
    hidden
    lg:flex
    lg:flex-col
    h-screen
    w-72
    shrink-0
    sticky
    top-0
    bg-white
    border-r
    border-slate-200
    shadow-sm
  `;

  const logo = createLogo();

  const menu = createMenu(

    rol,

    activePath

  );

  sidebar.append(

    logo,

    menu

  );

  return sidebar;

}

// ======================================================
// MobileSidebar (drawer para pantallas < lg)
// ======================================================
//
// Panel deslizable con backdrop, controlado externamente
// (Topbar) a través de los métodos open()/close()/toggle()
// que devuelve. Solo debe renderizarse una vez por página,
// ya que cada navegación remonta todo el DashboardLayout.
//
// ======================================================

export function MobileSidebar({

    activePath = "/"

} = {}) {

    const user = getSession() || {};

    const rol = user.rol || "estudiante";

    // ----------------------------
    // Contenedor (overlay completo)
    // ----------------------------

    const container = document.createElement("div");

    container.className = `
        fixed
        inset-0
        z-40
        hidden
        lg:hidden
    `;

    // ----------------------------
    // Backdrop
    // ----------------------------

    const backdrop = document.createElement("div");

    backdrop.className = `
        absolute
        inset-0
        bg-black/50
        opacity-0
        transition-opacity
        duration-300
    `;

    // ----------------------------
    // Panel
    // ----------------------------

    const panel = document.createElement("aside");

    panel.className = `
        absolute
        left-0
        top-0
        flex
        h-full
        w-72
        max-w-[85vw]
        -translate-x-full
        flex-col
        bg-white
        shadow-2xl
        transition-transform
        duration-300
        ease-in-out
    `;

    const closeButton = document.createElement("button");

    closeButton.type = "button";

    closeButton.setAttribute("aria-label", "Cerrar menú");

    closeButton.className = `
        absolute
        right-3
        top-3
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        text-slate-500
        transition
        hover:bg-slate-100
    `;

    closeButton.innerHTML = `<i class="fa-solid fa-xmark text-xl"></i>`;

    const logo = createLogo();

    const menu = createMenu(

        rol,

        activePath

    );

    panel.append(

        closeButton,

        logo,

        menu

    );

    container.append(

        backdrop,

        panel

    );

    // ----------------------------
    // Abrir / cerrar
    // ----------------------------

    function open() {

        container.classList.remove("hidden");

        document.body.classList.add("overflow-hidden");

        // Se retira "hidden" primero y en el siguiente frame se
        // activan las clases de transición para que el slide-in
        // se anime correctamente.
        requestAnimationFrame(() => {

            backdrop.classList.remove("opacity-0");

            panel.classList.remove("-translate-x-full");

        });

        document.addEventListener("keydown", onKeydown);

    }

    function close() {

        backdrop.classList.add("opacity-0");

        panel.classList.add("-translate-x-full");

        document.body.classList.remove("overflow-hidden");

        document.removeEventListener("keydown", onKeydown);

        setTimeout(() => {

            container.classList.add("hidden");

        }, 300);

    }

    function toggle() {

        container.classList.contains("hidden") ? open() : close();

    }

    function onKeydown(event) {

        if (event.key === "Escape") close();

    }

    backdrop.addEventListener("click", close);

    closeButton.addEventListener("click", close);

    // Cerrar el drawer al navegar (los enlaces del menú usan
    // data-link y son interceptados por el router).
    menu.addEventListener("click", (event) => {

        if (event.target.closest("[data-link]")) close();

    });

    return {

        element: container,

        open,

        close,

        toggle

    };

}