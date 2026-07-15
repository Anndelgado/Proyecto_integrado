document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. BASE DE DATOS INICIAL DE PRUEBA (Para primer inicio)
    // ==========================================================
    const DEFAULT_INSTITUTIONS = [
        {
            name: "IED La Concepción",
            dane: "108001002341",
            address: "Cl. 75 # 65-10",
            localidad: "Riomar",
            rector: "Dr. Ricardo Silva",
            psicologo: "Dra. Elena Mendoza",
            teachers: 42,
            alerts: { critical: 5, medium: 12 }
        },
        {
            name: "IED Jorge Robledo",
            dane: "108001005982",
            address: "Cra. 21B # 68C-45",
            localidad: "Suroccidente",
            rector: "Lic. Martha Gómez",
            psicologo: "Dra. Ana Milena Rey",
            teachers: 56,
            alerts: { critical: 0, medium: 4 }
        },
        {
            name: "IED San José",
            dane: "108001001122",
            address: "Cl. 38 # 22-05",
            localidad: "Suroriente",
            rector: "Ing. Marcos Pineda",
            psicologo: "", // "Sin Asignar"
            teachers: 31,
            alerts: { critical: 0, medium: 0 } // Estable
        }
    ];

    // Cargar desde LocalStorage o guardar los por defecto si está vacío
    let storedData = localStorage.getItem('institutions');
    let institutions = [];

    if (storedData) {
        institutions = JSON.parse(storedData);
        if (institutions.length === 0) {
            institutions = DEFAULT_INSTITUTIONS;
            localStorage.setItem('institutions', JSON.stringify(institutions));
        }
    } else {
        institutions = DEFAULT_INSTITUTIONS;
        localStorage.setItem('institutions', JSON.stringify(institutions));
    }

    // ==========================================================
    // 2. CAPTURA DE ELEMENTOS DOM
    // ==========================================================
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const filterLocalidad = document.getElementById('filterLocalidad');
    const filterRiesgo = document.getElementById('filterRiesgo');

    // Menú Perfil y Hamburguesa
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Modales y formularios
    const institutionModal = document.getElementById('institutionModal');
    const institutionForm = document.getElementById('institutionForm');
    const modalTitle = document.getElementById('modalTitle');
    const instIndex = document.getElementById('instIndex');
    const btnOpenAddModal = document.getElementById('btnOpenAddModal');
    const closeInstModal = document.getElementById('closeInstModal');
    const btnCancelInst = document.getElementById('btnCancelInst');

    const directorsModal = document.getElementById('directorsModal');
    const directorsForm = document.getElementById('directorsForm');
    const dirInstIndex = document.getElementById('dirInstIndex');
    const dirModalSchoolName = document.getElementById('dirModalSchoolName');
    const closeDirModal = document.getElementById('closeDirModal');
    const btnCancelDir = document.getElementById('btnCancelDir');


    // ==========================================================
    // 3. RENDERIZADO REACTIVO DE LA TABLA
    // ==========================================================
    function renderTable() {
        tableBody.innerHTML = '';

        if (institutions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: #a0aec0;">No hay instituciones registradas.</td></tr>`;
            return;
        }

        institutions.forEach((inst, index) => {
            // Estructura de psicólogo asignado o "Sin Asignar"
            const psocologoMarkup = inst.psicologo.trim() !== "" 
                ? `Dra. ${inst.psicologo}` 
                : `<span class="text-unassigned"><i class="fa-solid fa-triangle-exclamation"></i> Sin Asignar</span>`;

            // Semáforo de Alertas
            let semaforoMarkup = '';
            if (inst.alerts.critical > 0) {
                semaforoMarkup = `
                    <div class="alert-semaphore">
                        <span class="badge-alert alert-critica">${inst.alerts.critical} Críticas</span>
                        <span class="badge-alert alert-media">${inst.alerts.medium} Medias</span>
                    </div>`;
            } else if (inst.alerts.medium > 0) {
                semaforoMarkup = `
                    <div class="alert-semaphore">
                        <span class="badge-alert alert-critica-zero">0 Críticas</span>
                        <span class="badge-alert alert-media">${inst.alerts.medium} Medias</span>
                    </div>`;
            } else {
                semaforoMarkup = `
                    <div class="alert-semaphore">
                        <span class="badge-alert alert-estable">Estable</span>
                    </div>`;
            }

            // Clase obligatoria para avisar psicóloga vacía
            const isUnassignedClass = inst.psicologo.trim() === "" ? "highlight-alert" : "";

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${inst.name}</strong><br>
                    <span class="sub-text">DANE: ${inst.dane}</span><br>
                    <span class="sub-text text-light">${inst.address}</span>
                </td>
                <td>${inst.localidad}</td>
                <td>
                    <span class="manager-title">Rector:</span> ${inst.rector}<br>
                    <span class="manager-title">Psicóloga:</span> ${psocologoMarkup}
                </td>
                <td>
                    <strong>${inst.teachers}</strong> <span class="sub-text text-light">Profesores</span>
                </td>
                <td>${semaforoMarkup}</td>
                <td>
                    <div class="actions-btn-group">
                        <button class="btn-action edit-btn" data-index="${index}" title="Editar Institución"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action rapid-assign ${isUnassignedClass}" data-index="${index}" title="Asignar Psicóloga / Rector"><i class="fa-solid fa-user-gear"></i></button>
                        <button class="btn-action view-details" data-name="${inst.name}" title="Ver Ficha Detallada"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Filtrar inmediatamente después de renderizar para respetar criterios activos
        filtrarInstituciones();
    }


    // ==========================================================
    // 4. FUNCIÓN DE FILTRADO COMBINADO
    // ==========================================================
    function filtrarInstituciones() {
        const query = searchInput.value.toLowerCase().trim();
        const localidadValue = filterLocalidad.value;
        const riesgoValue = filterRiesgo.value;

        const rows = tableBody.querySelectorAll('tr');

        rows.forEach((row, i) => {
            // Verificar si la fila contiene texto de no coincidencia
            if (row.cells.length < 6) return; 

            const inst = institutions[i];
            if (!inst) return;

            // Filtro de Búsqueda (Nombre o DANE)
            const matchSearch = inst.name.toLowerCase().includes(query) || inst.dane.includes(query);

            // Filtro de Localidad
            const matchLocalidad = localidadValue === "" || inst.localidad === localidadValue;

            // Filtro de Riesgo
            let matchRiesgo = false;
            if (riesgoValue === "") {
                matchRiesgo = true;
            } else if (riesgoValue === "critico") {
                matchRiesgo = inst.alerts.critical > 0;
            } else if (riesgoValue === "moderado") {
                matchRiesgo = inst.alerts.medium > 0 && inst.alerts.critical === 0;
            } else if (riesgoValue === "estable") {
                matchRiesgo = inst.alerts.critical === 0 && inst.alerts.medium === 0;
            }

            // Aplicar visibilidad
            if (matchSearch && matchLocalidad && matchRiesgo) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filtrarInstituciones);
    filterLocalidad.addEventListener('change', filtrarInstituciones);
    filterRiesgo.addEventListener('change', filtrarInstituciones);


    // ==========================================================
    // 5. EVENTOS DE MODALES Y FORMULARIOS
    // ==========================================================

    // Abrir modal de Registro
    btnOpenAddModal.addEventListener('click', () => {
        modalTitle.innerText = "Registrar Nueva Institución";
        institutionForm.reset();
        instIndex.value = ""; // Vacio indica registro nuevo
        institutionModal.classList.add('show');
    });

    // Cerrar modal de Institución
    const closeInst = () => { institutionModal.classList.remove('show'); };
    closeInstModal.addEventListener('click', closeInst);
    btnCancelInst.addEventListener('click', closeInst);

    // Guardar / Editar Institución
    institutionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const index = instIndex.value;
        const newInstData = {
            name: document.getElementById('instName').value,
            dane: document.getElementById('instDane').value,
            address: document.getElementById('instAddress').value,
            localidad: document.getElementById('instLocalidad').value,
            teachers: parseInt(document.getElementById('instDocentes').value) || 0,
        };

        if (index === "") {
            // REGISTRO NUEVO: Se inicializa con alertas en cero (Estable) y sin personal asignado
            newInstData.rector = "Sin Asignar";
            newInstData.psicologo = "";
            newInstData.alerts = { critical: 0, medium: 0 };
            institutions.push(newInstData);
        } else {
            // EDITAR EXISTENTE: Conservamos valores de personal y alertas anteriores
            const i = parseInt(index);
            institutions[i].name = newInstData.name;
            institutions[i].dane = newInstData.dane;
            institutions[i].address = newInstData.address;
            institutions[i].localidad = newInstData.localidad;
            institutions[i].teachers = newInstData.teachers;
        }

        localStorage.setItem('institutions', JSON.stringify(institutions));
        renderTable();
        closeInst();
    });


    // Cerrar modal de Directivos
    const closeDir = () => { directorsModal.classList.remove('show'); };
    closeDirModal.addEventListener('click', closeDir);
    btnCancelDir.addEventListener('click', closeDir);

    // Guardar Directivos
    directorsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(dirInstIndex.value);

        // Sanear el texto de "Dra." o "Lic." si el usuario ya lo escribe
        let rectorValue = document.getElementById('dirRector').value.trim();
        let psicologoValue = document.getElementById('dirPsicologo').value.trim();

        // Limpiar prefijos duplicados si se ingresaron
        rectorValue = rectorValue.replace(/^(dr\.|dra\.|lic\.|ing\.)\s+/i, '');
        psicologoValue = psicologoValue.replace(/^(dr\.|dra\.|lic\.|ing\.)\s+/i, '');

        institutions[index].rector = rectorValue;
        institutions[index].psicologo = psicologoValue;

        localStorage.setItem('institutions', JSON.stringify(institutions));
        renderTable();
        closeDir();
    });


    // ==========================================================
    // 6. CONTROLADORES DE EVENTOS EN ACCIONES (Delegación Dinámica)
    // ==========================================================
    tableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-action');
        if (!button) return;

        const index = button.getAttribute('data-index');

        // Acción: Editar Institución
        if (button.classList.contains('edit-btn')) {
            const inst = institutions[index];
            modalTitle.innerText = "Editar Institución Educativa";
            instIndex.value = index;

            document.getElementById('instName').value = inst.name;
            document.getElementById('instDane').value = inst.dane;
            document.getElementById('instAddress').value = inst.address;
            document.getElementById('instLocalidad').value = inst.localidad;
            document.getElementById('instDocentes').value = inst.teachers;

            institutionModal.classList.add('show');
        }

        // Acción: Configurar Directivos
        if (button.classList.contains('rapid-assign')) {
            const inst = institutions[index];
            dirInstIndex.value = index;
            dirModalSchoolName.innerText = inst.name;

            // Limpiamos prefijos al cargar los inputs para evitar duplicación visual
            document.getElementById('dirRector').value = inst.rector.replace(/^(dr\.|dra\.|lic\.|ing\.)\s+/i, '');
            document.getElementById('dirPsicologo').value = inst.psicologo.replace(/^(dr\.|dra\.|lic\.|ing\.)\s+/i, '');

            directorsModal.classList.add('show');
        }

        // Acción: Ver Historial Detallado
        if (button.classList.contains('view-details')) {
            const schoolName = button.getAttribute('data-name');
            alert(`🔍 Cargando expediente histórico y ficha técnica del ${schoolName}.`);
        }
    });


    // ==========================================================
    // 7. RESPONSIVIDAD Y MENÚS FLOTANTES (Perfil y Hamburguesa)
    // ==========================================================

    // Toggle Dropdown del Perfil
    profileDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownMenu.classList.toggle('show');
    });

    // Cerrar Dropdown si se hace clic fuera de él
    document.addEventListener('click', () => {
        profileDropdownMenu.classList.remove('show');
    });

    // Cierre de Sesión
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            window.location.href = "/src/views/aut/login.html"; 
        }
    });

    // Toggle Sidebar en Móviles
    mobileNavToggle.addEventListener('click', () => {
        sidebarMenu.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    // Cerrar barra lateral móvil haciendo clic fuera
    sidebarOverlay.addEventListener('click', () => {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });


    // ==========================================================
    // 8. RENDER DE INICIO
    // ==========================================================
    renderTable();
});