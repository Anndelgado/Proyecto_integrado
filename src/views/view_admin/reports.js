document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. BASE DE DATOS ESTRUCTURADA DE REPORTES
    // ==========================================================
    const REPORTS_DATABASE = [
        {
            id: "REP-2026-001",
            school: "IED La Concepción",
            psychologist: "Dra. Carmen Mendoza",
            teacher: "Prof. Carlos Ortiz",
            category: "Acoso Escolar",
            categoryClass: "acoso",
            date: "12/07/2026",
            size: "2.4 MB"
        },
        {
            id: "REP-2026-002",
            school: "IED Jorge Robledo",
            psychologist: "Dr. Andrés Ruiz",
            teacher: "Profa. Marta Martínez",
            category: "Riesgo Psicosocial",
            categoryClass: "riesgo",
            date: "11/07/2026",
            size: "1.8 MB"
        },
        {
            id: "REP-2026-003",
            school: "IED San José",
            psychologist: "Dra. Elena Gómez",
            teacher: "Prof. Luis Peralta",
            category: "Deserción / Ausentismo",
            categoryClass: "desercion",
            date: "09/07/2026",
            size: "950 KB"
        },
        {
            id: "REP-2026-004",
            school: "IED La Concepción",
            psychologist: "Dra. Carmen Mendoza",
            teacher: "Prof. Luis Peralta",
            category: "Riesgo Psicosocial",
            categoryClass: "riesgo",
            date: "05/07/2026",
            size: "3.1 MB"
        },
        {
            id: "REP-2026-005",
            school: "IED Jorge Robledo",
            psychologist: "Dra. Elena Gómez",
            teacher: "Prof. Carlos Ortiz",
            category: "Acoso Escolar",
            categoryClass: "acoso",
            date: "28/06/2026",
            size: "1.2 MB"
        }
    ];

    // Elementos de filtrado del DOM
    const searchGeneral = document.getElementById('searchGeneral');
    const filterInstitution = document.getElementById('filterInstitution');
    const filterPsychologist = document.getElementById('filterPsychologist');
    const filterTeacher = document.getElementById('filterTeacher');
    
    // Tabla y contadores
    const reportsTableBody = document.getElementById('reportsTableBody');
    const resultsCount = document.getElementById('resultsCount');

    // Elementos del Modal Visor PDF
    const pdfModal = document.getElementById('pdfModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnDownloadFromModal = document.getElementById('btnDownloadFromModal');
    
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const pdfMetaCode = document.getElementById('pdfMetaCode');
    const pdfMetaDate = document.getElementById('pdfMetaDate');
    const pdfViewSchool = document.getElementById('pdfViewSchool');
    const pdfViewPsych = document.getElementById('pdfViewPsych');
    const pdfViewTeacher = document.getElementById('pdfViewTeacher');
    const pdfViewCategory = document.getElementById('pdfViewCategory');

    // Interfaz general y Responsive
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    let activeReportForDownload = null;

    // ==========================================================
    // 2. FUNCIÓN DE RENDERIZADO Y FILTRADO COMBINADO
    // ==========================================================
    function renderReports() {
        const query = searchGeneral.value.toLowerCase().trim();
        const instFilter = filterInstitution.value;
        const psychFilter = filterPsychologist.value;
        const teacherFilter = filterTeacher.value;

        // Filtrar elementos de la colección
        const filteredReports = REPORTS_DATABASE.filter(report => {
            const matchesQuery = report.id.toLowerCase().includes(query) || 
                                 report.category.toLowerCase().includes(query);
            
            const matchesInst = (instFilter === "Todos" || report.school === instFilter);
            const matchesPsych = (psychFilter === "Todos" || report.psychologist === psychFilter);
            const matchesTeacher = (teacherFilter === "Todos" || report.teacher === teacherFilter);

            return matchesQuery && matchesInst && matchesPsych && matchesTeacher;
        });

        // Actualizar contador visual superior
        resultsCount.innerText = `Mostrando ${filteredReports.length} reporte${filteredReports.length === 1 ? '' : 's'}`;

        // Limpiar cuerpo de la tabla
        reportsTableBody.innerHTML = '';

        if (filteredReports.length === 0) {
            reportsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--secondary-color); padding: 30px;">No se encontraron reportes con los filtros seleccionados.</td></tr>`;
            return;
        }

        // Construir filas idénticas al estilo limpio de usuarios
        filteredReports.forEach(report => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="doc-name">
                        <div class="doc-icon-wrapper"><i class="fa-solid fa-file-pdf"></i></div>
                        <div class="doc-info-meta">
                            <span class="doc-code">${report.id}</span>
                            <span class="doc-size">Tamaño: ${report.size}</span>
                        </div>
                    </div>
                </td>
                <td><strong>${report.school}</strong><br><small style="color:var(--secondary-color)">Distrito Barranquilla</small></td>
                <td>
                    <div class="people-stack">
                        <span><i class="fa-solid fa-user-doctor" style="font-size:11px; color:var(--primary-color)"></i> ${report.psychologist}</span>
                        <small><i class="fa-solid fa-chalkboard-user" style="font-size:10px"></i> Retoma: ${report.teacher}</small>
                    </div>
                </td>
                <td><span class="badge-category ${report.categoryClass}">${report.category}</span></td>
                <td>${report.date}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-view-pdf" data-id="${report.id}"><i class="fa-solid fa-eye"></i> Ver PDF</button>
                        <button class="btn-download-pdf" data-id="${report.id}"><i class="fa-solid fa-download"></i> Bajar</button>
                    </div>
                </td>
            `;
            reportsTableBody.appendChild(tr);
        });

        // Adjuntar eventos a los botones recién creados en la lista
        document.querySelectorAll('.btn-view-pdf').forEach(btn => {
            btn.addEventListener('click', () => openPDFViewer(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.btn-download-pdf').forEach(btn => {
            btn.addEventListener('click', () => triggerDownload(btn.getAttribute('data-id')));
        });
    }

    // ==========================================================
    // 3. LOGICA DEL VISOR MODAL Y DESCARGAS
    // ==========================================================
    function openPDFViewer(id) {
        const report = REPORTS_DATABASE.find(r => r.id === id);
        if (!report) return;

        activeReportForDownload = report;

        // Inyectar metadatos en la hoja simulada del PDF
        pdfModalTitle.innerHTML = `<i class="fa-solid fa-file-pdf" style="color: #e74c3c; margin-right: 8px;"></i> Visor: ${report.id}`;
        pdfMetaCode.innerText = report.id;
        pdfMetaDate.innerText = report.date;
        pdfViewSchool.innerText = report.school;
        pdfViewPsych.innerText = report.psychologist;
        pdfViewTeacher.innerText = report.teacher;
        pdfViewCategory.innerText = report.category;

        pdfModal.classList.add('show');
    }

    function closePDFViewer() {
        pdfModal.classList.remove('show');
        activeReportForDownload = null;
    }

    function triggerDownload(id) {
        const report = REPORTS_DATABASE.find(r => r.id === id);
        if (!report) return;
        
        alert(`Iniciando descarga del archivo oficial:\n[${report.id}.pdf] (${report.size})\nGuardado exitosamente en tu dispositivo.`);
    }

    // Escuchadores del Modal
    closeModalBtn.addEventListener('click', closePDFViewer);
    btnCancelModal.addEventListener('click', closePDFViewer);
    btnDownloadFromModal.addEventListener('click', () => {
        if (activeReportForDownload) {
            triggerDownload(activeReportForDownload.id);
            closePDFViewer();
        }
    });

    // Escuchadores de filtros en tiempo real
    searchGeneral.addEventListener('input', renderReports);
    filterInstitution.addEventListener('change', renderReports);
    filterPsychologist.addEventListener('change', renderReports);
    filterTeacher.addEventListener('change', renderReports);

    // ==========================================================
    // 4. ELEMENTOS DE CONTROL GLOBAL (Perfil y Hamburguesa)
    // ==========================================================
    profileDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        profileDropdownMenu.classList.remove('show');
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            window.location.href = "/src/views/aut/login.html"; 
        }
    });

    mobileNavToggle.addEventListener('click', () => {
        sidebarMenu.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // Inicialización por defecto
    renderReports();
});