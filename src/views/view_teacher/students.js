document.addEventListener('DOMContentLoaded', () => {
    // 1. Inyectar navegación
    inyectarMenuDocente();

    // 2. Cargar registros de estudiantes base
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

    renderizarEstudiantes();
    inicializarEventosGestion();
});

// Generación exacta del Menú con foco en la sección "Mis estudiantes"
function inyectarMenuDocente() {
    const menuContainer = document.getElementById('sidebarMenu');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <ul>
                <li>
                    <a href="/src/views/view_teacher/index.html">
                        <i class="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </a>
                </li>
                <li>
                    <a href="/src/views/view_teacher/students.html" class="active">
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

// Pintar filas dinámicas aplicando filtros
function renderizarEstudiantes() {
    const estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];
    const searchVal = document.getElementById('filter-search').value.toLowerCase();
    const statusVal = document.getElementById('filter-status').value;
    const tablaBody = document.getElementById('tabla-gestion-body');

    if (!tablaBody) return;
    tablaBody.innerHTML = '';

    const filtrados = estudiantes.filter(est => {
        const cumpleNombre = est.nombre.toLowerCase().includes(searchVal);
        const cumpleEstado = statusVal === '' || est.estado === statusVal;
        return cumpleNombre && cumpleEstado;
    });

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:30px;">No se encontraron alumnos con los filtros seleccionados.</td></tr>`;
        return;
    }

    filtrados.forEach(est => {
        let colorClase = 'stable';
        if (est.estado === 'En riesgo') colorClase = 'risk';
        if (est.estado === 'En riesgo alto') colorClase = 'high-risk';

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${est.nombre}</strong></td>
            <td><span class="course-badge" style="background:#f1f5f9; color:#475569;">${est.curso}</span></td>
            <td><span class="status-badge ${colorClase}">${est.estado}</span></td>
            <td>${est.ultimoTest || 'Sin realizar'}</td>
            <td style="text-align: right;">
                <button class="btn-view-student btn-test" data-id="${est.id}" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; margin-right:6px;">
                    <i class="fa-solid fa-square-poll-horizontal"></i> Test
                </button>
                <button class="btn-view-student btn-editar" data-id="${est.id}">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

function inicializarEventosGestion() {
    const modal = document.getElementById('modal-estudiante');
    const form = document.getElementById('form-estudiante');
    
    // Filtros reactivos
    document.getElementById('filter-search').addEventListener('input', renderizarEstudiantes);
    document.getElementById('filter-status').addEventListener('change', renderizarEstudiantes);

    // Menú Hamburguesa Responsivo Móvil
    const menuToggle = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebarBtn');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('show');
        });

        const cerrarMenu = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        };

        overlay.addEventListener('click', cerrarMenu);
        if (closeSidebar) closeSidebar.addEventListener('click', cerrarMenu);
    }

    // Dropdown del Topbar
    const profileBtn = document.getElementById('profileDropdownBtn');
    const profileMenu = document.getElementById('profileMenu');
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });
        document.addEventListener('click', () => profileMenu.classList.remove('show'));
    }

    // Botón Cerrar Sesión
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('userRole');
        window.location.href = '../view_admin/login.html';
    });

    // Abrir Modal Crear Nuevo
    document.getElementById('btn-nuevo-estudiante').addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Registrar Alumno';
        form.reset();
        document.getElementById('student-id').value = '';
        document.getElementById('student-date').value = new Date().toLocaleDateString('es-ES');
        modal.classList.add('show');
    });

    // Escuchar clicks de Editar o realizar Test dentro de la tabla
    document.getElementById('tabla-gestion-body').addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        const btnTest = e.target.closest('.btn-test');
        const estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];

        if (btnEditar) {
            const id = parseInt(btnEditar.getAttribute('data-id'), 10);
            const est = estudiantes.find(item => item.id === id);
            if (est) {
                document.getElementById('modal-title').textContent = 'Editar Información del Alumno';
                document.getElementById('student-id').value = est.id;
                document.getElementById('student-name').value = est.nombre;
                document.getElementById('student-course').value = est.curso;
                document.getElementById('student-status').value = est.estado;
                document.getElementById('student-date').value = est.ultimoTest || '';
                modal.classList.add('show');
            }
        }

        if (btnTest) {
            const id = parseInt(btnTest.getAttribute('data-id'), 10);
            const estIdx = estudiantes.findIndex(item => item.id === id);
            if (estIdx !== -1) {
                const hoy = new Date().toLocaleDateString('es-ES');
                estudiantes[estIdx].ultimoTest = hoy;
                localStorage.setItem('estudiantes_9A', JSON.stringify(estudiantes));
                renderizarEstudiantes();
                alert(`Se ha enviado la solicitud de Test de tamizaje emocional a ${estudiantes[estIdx].nombre} para responder el día de hoy (${hoy}).`);
            }
        }
    });

    // Envío del Formulario (Crear o Guardar Modificaciones)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let estudiantes = JSON.parse(localStorage.getItem('estudiantes_9A')) || [];
        const idVal = document.getElementById('student-id').value;
        
        const data = {
            nombre: document.getElementById('student-name').value,
            curso: document.getElementById('student-course').value,
            estado: document.getElementById('student-status').value,
            ultimoTest: document.getElementById('student-date').value
        };

        if (idVal === '') {
            // Operación Crear
            data.id = estudiantes.length > 0 ? Math.max(...estudiantes.map(o => o.id)) + 1 : 1;
            estudiantes.push(data);
        } else {
            // Operación Editar
            const id = parseInt(idVal, 10);
            const idx = estudiantes.findIndex(item => item.id === id);
            if (idx !== -1) {
                data.id = id;
                estudiantes[idx] = data;
            }
        }

        localStorage.setItem('estudiantes_9A', JSON.stringify(estudiantes));
        modal.classList.remove('show');
        renderizarEstudiantes();
    });

    // Cerrar Modales
    const cerrarModal = () => modal.classList.remove('show');
    document.getElementById('close-student-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-cancelar-modal').addEventListener('click', cerrarModal);

    // Cargar / Importar Base de Datos Local JSON
    const fileInput = document.getElementById('importFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const parsedData = JSON.parse(evt.target.result);
                    if (Array.isArray(parsedData)) {
                        // Guardamos y acoplamos los registros nuevos en el localStorage
                        localStorage.setItem('estudiantes_9A', JSON.stringify(parsedData));
                        renderizarEstudiantes();
                        alert('¡Base de datos cargada e importada con éxito!');
                    } else {
                        alert('El archivo JSON cargado no posee el formato de lista correcto.');
                    }
                } catch (err) {
                    alert('Error al leer el archivo JSON. Verifica su estructura.');
                }
            };
            reader.readAsText(file);
        });
    }
}