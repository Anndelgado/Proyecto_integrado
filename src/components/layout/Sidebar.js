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
    items-center
    justify-center
    border-b
    border-slate-200
    px-6
    py-7
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
        class="h-14 w-auto"
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
// Sidebar
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