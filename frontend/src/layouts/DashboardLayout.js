import { Sidebar, MobileSidebar } from "../components/layout/Sidebar.js";
import { Topbar } from "../components/layout/Topbar.js";

export function DashboardLayout({

    activePath = "/",

    title = "Dashboard",

    content

} = {}) {

    const layout = document.createElement("div");

    layout.className = `
        h-screen
        bg-slate-100
    `;
    const wrapper = document.createElement("div");

    wrapper.className = `
        flex
        h-screen
    `;
    const sidebar = Sidebar({

        activePath

    });
    const mobileSidebar = MobileSidebar({

        activePath

    });
    const contentWrapper = document.createElement("div");

    contentWrapper.className = `
        flex
        h-screen
        flex-1
        flex-col
        overflow-hidden
    `;
    const topbar = Topbar({

        title,

        onMenuClick: () => mobileSidebar.open()

    });
    const main = document.createElement("main");

    main.className = `
        flex-1
        overflow-y-auto
        p-4
        sm:p-6
        lg:p-8
    `;

    main.appendChild(content);
    contentWrapper.append(

        topbar,

        main

    );
    wrapper.append(
        sidebar,
        contentWrapper
    );
    layout.append(
        wrapper,
        mobileSidebar.element
    );
    return layout;
}