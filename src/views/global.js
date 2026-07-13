document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole') || 'admin'; 

    const nombresRoles = {
        admin: 'Administrador',
        psicologo: 'Orientador Escolar',
        docente: 'Docente de Aula'
    };

    const menusPorRol = {
        admin: [
            { link: '../view_admin/index.html', icon: 'fa-house', label: 'Inicio' },
            { link: '../view_admin/users.html', icon: 'fa-users', label: 'Usuarios' },
            { link: '../view_admin/institutions.html', icon: 'fa-school', label: 'Instituciones' },
            { link: '../view_admin/alerts.html', icon: 'fa-bell', label: 'Alertas' },
            { link: '../view_admin/statistics.html', icon: 'fa-chart-line', label: 'Estadísticas' },
            { link: '../view_admin/reports.html', icon: 'fa-file-contract', label: 'Reportes' },
            { link: '../view_admin/config.html', icon: 'fa-gear', label: 'Configuración' }
        ],
        psicologo: [
            { link: '../view_psychologist/index.html', icon: 'fa-house', label: 'Inicio' },
            { link: '../view_psychologist/cases.html', icon: 'fa-folder-open', label: 'Mis Casos' }
        ],
        docente: [
            { link: '../view_teacher/index.html', icon: 'fa-house', label: 'Inicio' },
            { link: '../view_teacher/report.html', icon: 'fa-bullhorn', label: 'Reportar Alerta' }
        ]
    };

    // 1. RENDERIZAR SIDEBAR (Se mantiene fiel a tus clases)
    const sidebarContainer = document.querySelector('.sidebar');
    if (sidebarContainer) {
        const opciones = menusPorRol[userRole] || [];
        const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

        let sidebarHTML = `
            <div class="logo-space">
                <p>Logo de Barranquilla Convive (Medidas aprox: 150px x 60px)</p>
            </div>
            <nav>
                <ul>
        `;

        opciones.forEach(item => {
            const esActivo = item.link.includes(paginaActual) ? 'class="active"' : '';
            sidebarHTML += `
                <li>
                    <a href="${item.link}" ${esActivo}>
                        <i class="fa-solid ${item.icon}"></i> ${item.label}
                    </a>
                </li>
            `;
        });

        sidebarHTML += `</ul></nav>`;
        sidebarContainer.innerHTML = sidebarHTML;
    }

// 2. RENDERIZAR TOP BAR (Dentro de global.js)
    const topHeaderContainer = document.querySelector('.top-header');
    if (topHeaderContainer) {
        const nombreMostrar = nombresRoles[userRole] || 'Usuario';

        topHeaderContainer.innerHTML = `
            <div class="header-welcome">
                <h1>Bienvenido, ${nombreMostrar}</h1>
                <p>Resumen general de la plataforma</p>
            </div>
            <div class="header-profile">
                
                <div class="notif-wrapper">
                    <i class="fa-regular fa-bell" id="notif-trigger"></i>
                    <span class="notification-badge" id="notif-count">3</span>
                    
                    <div class="dropdown-panel" id="notif-dropdown">
                        <div class="dropdown-title">Alertas Recientes</div>
                        <ul>
                            <li>⚠️ <strong>Caso #1256:</strong> IED La Concepción (Alto)</li>
                            <li>📅 Reporte distrital consolidado con éxito.</li>
                        </ul>
                    </div>
                </div>

                <div class="profile-info" id="profile-trigger">
                    <img src="avatar.png" alt="Avatar Administrador"> 
                    <span>${nombreMostrar}</span>
                    <i class="fa-solid fa-chevron-down"></i>
                    
                    <div class="dropdown-menu" id="profile-dropdown">
                        <a href="../view_admin/config.html"><i class="fa-solid fa-gear"></i> Configuración</a>
                        <hr>
                        <a href="#" id="btn-logout" class="logout-link"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a>
                    </div>
                </div>
            </div>
        `;

        inicializarInteraccionesBarraSuperior();
    }

    function inicializarInteraccionesBarraSuperior() {
        const profileTrigger = document.getElementById('profile-trigger');
        const profileDropdown = document.getElementById('profile-dropdown');
        const notifTrigger = document.getElementById('notif-trigger');
        const notifDropdown = document.getElementById('notif-dropdown');
        const notifCount = document.getElementById('notif-count');
        const btnLogout = document.getElementById('btn-logout');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
                if (notifDropdown) notifDropdown.classList.remove('show');
            });
        }

        if (notifTrigger && notifDropdown) {
            notifTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                notifDropdown.classList.toggle('show');
                if (profileDropdown) profileDropdown.classList.remove('show');
                if (notifCount) {
                    notifCount.style.transform = "scale(0)";
                    setTimeout(() => notifCount.remove(), 150);
                }
            });
        }

        document.addEventListener('click', () => {
            if (profileDropdown) profileDropdown.classList.remove('show');
            if (notifDropdown) notifDropdown.classList.remove('show');
        });

        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    localStorage.clear();
                    window.location.href = "../auth/login.html";
                }
            });
        }
    }
});