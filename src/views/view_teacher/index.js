document.addEventListener('DOMContentLoaded', () => {
    // 1. Forzar el Rol de Docente en sesión para evitar colisiones
    localStorage.setItem('userRole', 'docente');

    // 2. Inyectar Dinámicamente el Menú con solo las 3 opciones del Docente
    inyectarMenuDocente();

    // 3. Inicializar Datos en LocalStorage si no existen
    inicializarBaseDeDatosSimulada();

    // 4. Renderizar la tabla de Alumnos y las métricas de las tarjetas
    actualizarPanelDocente();

    // 5. Encender los eventos del DOM (dropdowns, modal, etc.)
    inicializarManejadoresDeEventos();
});

function inyectarMenuDocente() {
    const menuContainer = document.getElementById('sidebarMenu');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <ul>
                <li>
                    <a href="/src/views/view_teacher/index.html" class="active">
                        <i class="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </a>
                </li>
                <li>
                    <a href="/src/views/view_teacher/index.html">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>Mis estudiantes</span>
                    </a>
                </li>
                <li>
                    <a href="/src/views/view_teacher/report.html">
                        <i class="fa-solid fa-bullhorn"></i>
                        <span>Alertas</span>
                    </a>
                </li>
            </ul>
        `;
    }
}

function inicializarBaseDeDatosSimulada() {
    // Estudiantes Base
    if (!localStorage.getItem('estudiantes_9A')) {
        const estudiantesMock = [
            { id: 1, nombre: 'María José Torres', curso: '9°A', estado: 'Estable', ultimoTest: '20/06/2026' },
            { id: 2, nombre: 'Samuel Ortega', curso: '9°A', estado: 'En riesgo', ultimoTest: '18/05/2026' },
            { id: 3, nombre: 'Valentina Ruiz', curso: '9°A', estado: 'Estable', ultimoTest: '19/05/2026' },
            { id: 4, nombre: 'Andrés Duarte', curso: '9°A', estado: 'En riesgo alto', ultimoTest: '17/05/2026' },
            { id: 5, nombre: 'Laura Mendoza', curso: '9°A', estado: 'Estable', ultimoTest: '21/05/2026' }
        ];
        localStorage.setItem('estudiantes_9A', JSON.stringify(estudiantesMock));
    }

    // Alertas Base
    if (!localStorage.getItem('alertas_creadas')) {
        localStorage.setItem('alertas_creadas', '3'); // Iniciamos con 3 alertas creadas
    }

    // Tests Base
    if (!localStorage.getItem('test_pendientes')) {
        localStorage.setItem('test_pendientes', '17'); // Iniciamos con 17 test pendientes
    }
}

function actualizarPanelDocente() {
    const estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];
    const alertasCount = localStorage.getItem('alertas_creadas') || '3';
    const testCount = localStorage.getItem('test_pendientes') || '17';

    // Rellenar métricas
    document.getElementById('card-total-estudiantes').textContent = estudiantes.length;
    document.getElementById('card-alertas-creadas').textContent = alertasCount;
    document.getElementById('card-test-pendientes').textContent = testCount;

    // Rellenar filas de estudiantes
    const tablaBody = document.getElementById('tabla-estudiantes-body');
    if (tablaBody) {
        tablaBody.innerHTML = '';
        estudiantes.forEach(est => {
            let colorClase = 'stable';
            if (est.estado === 'En riesgo') colorClase = 'risk';
            if (est.estado === 'En riesgo alto') colorClase = 'high-risk';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${est.nombre}</strong></td>
                <td>${est.curso}</td>
                <td><span class="status-badge ${colorClase}">${est.estado}</span></td>
                <td>${est.ultimoTest}</td>
                <td>
                    <button class="btn-view-student" data-id="${est.id}">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }
}

function inicializarManejadoresDeEventos() {
    // Dropdown de Perfil
    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileMenu = document.getElementById('profileMenu');
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
            document.getElementById('notificationMenu').classList.remove('show');
        });
    }

    // Dropdown de Notificaciones
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationMenu = document.getElementById('notificationMenu');
    if (notificationBtn && notificationMenu) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationMenu.classList.toggle('show');
            profileMenu.classList.remove('show');
        });
    }

    // Cerrar los dropdowns al pulsar en cualquier otra parte
    document.addEventListener('click', () => {
        if (profileMenu) profileMenu.classList.remove('show');
        if (notificationMenu) notificationMenu.classList.remove('show');
    });

    // Cerrar sesión simulada
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert('Cerrando sesión...');
            localStorage.removeItem('userRole');
            window.location.href = '../view_admin/login.html'; // Ajusta según la ruta real de tu login
        });
    }

    // Abrir Modal de Detalle Estudiante
    const tablaBody = document.getElementById('tabla-estudiantes-body');
    const modal = document.getElementById('modal-detalle-estudiante');
    
    if (tablaBody && modal) {
        tablaBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-view-student');
            if (btn) {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                const estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];
                const est = estudiantes.find(item => item.id === id);

                if (est) {
                    document.getElementById('modal-student-name').textContent = est.nombre;
                    document.getElementById('modal-student-course').textContent = `Curso: ${est.curso}`;
                    document.getElementById('modal-student-status').textContent = est.estado;
                    document.getElementById('modal-student-date').textContent = est.ultimoTest;
                    modal.classList.add('show');
                }
            }
        });
    }

    // Cerrar modal al pulsar la equis (X)
    const btnCloseModal = document.getElementById('close-modal');
    if (btnCloseModal && modal) {
        btnCloseModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    // Cerrar modal al pulsar fuera del contenedor blanco
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Botón funcional para "Asignar Test Grupal"
    const btnActivarTest = document.getElementById('btn-activar-test');
    if (btnActivarTest) {
        btnActivarTest.addEventListener('click', () => {
            let countActual = parseInt(localStorage.getItem('test_pendientes'), 10) || 0;
            const estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];
            
            // Sumamos los tests del grupo completo (5 estudiantes)
            countActual += estudiantes.length;
            localStorage.setItem('test_pendientes', countActual.toString());

            // Actualizar la pantalla
            document.getElementById('card-test-pendientes').textContent = countActual;
            
            alert(`¡Test Grupal Activado! Se asignó el cuestionario a los ${estudiantes.length} estudiantes del grupo 9°A.`);
        });
    }
}