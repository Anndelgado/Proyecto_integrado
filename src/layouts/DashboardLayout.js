// ======================================================
// DashboardLayout.js
// Barranquilla Convive
// ======================================================

import { Sidebar } from "../components/layout/Sidebar.js";
import { Topbar } from "../components/layout/Topbar.js";

export function DashboardLayout({

    activePath = "/",

    title = "Dashboard",

    content

} = {}) {

    // ==================================================
    // Contenedor principal
    // ==================================================

    const layout = document.createElement("div");

    layout.className = `
        h-screen
        bg-slate-100
    `;

    // ==================================================
    // Wrapper
    // ==================================================

    const wrapper = document.createElement("div");

    wrapper.className = `
        flex
        h-screen
    `;

    // ==================================================
    // Sidebar
    // ==================================================

    const sidebar = Sidebar({

        activePath

    });

    // ==================================================
    // Contenido
    // ==================================================

    const contentWrapper = document.createElement("div");

    contentWrapper.className = `
        flex
        h-screen
        flex-1
        flex-col
        overflow-hidden
    `;

    // ==================================================
    // Topbar
    // ==================================================

    const topbar = Topbar({

        title

    });

    // ==================================================
    // Main
    // ==================================================

    const main = document.createElement("main");

    main.className = `
        flex-1
        overflow-y-auto
        p-8
    `;

    main.appendChild(content);

    // ==================================================
    // Ensamblar
    // ==================================================

    contentWrapper.append(

        topbar,

        main

    );

    wrapper.append(

        sidebar,

        contentWrapper

    );

    layout.appendChild(wrapper);

    return layout;

}