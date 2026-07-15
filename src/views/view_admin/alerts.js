document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. BASE DE DATOS INICIAL DE PRUEBAS (Según captura de pantalla)
    // ==========================================================
    const DEFAULT_ALERTS = [
        {
            radicado: "#1256",
            student: "Juan Andrés Pérez (10°B)",
            school: "IED La Concepción",
            localidad: "Riomar",
            type: "Riesgo Psicosocial / Ansiedad",
            risk: "Alto / Critico",
            date: "Hace 15 min",
            status: "Pendiente",
            notes: "Estudiante manifiesta niveles de estrés y ansiedad severos."
        },
        {
            radicado: "#1255",
            student: "Camila Rojas (8°A)",
            school: "IED Jorge Robledo",
            localidad: "Suroccidente",
            type: "Acoso Escolar (Bullying)",
            risk: "Medio",
            date: "Hace 1 hora",
            status: "En Proceso",
            notes: "Caso de exclusión social y burlas reportado por el director de grupo."
        },
        {
            radicado: "#1254",
            student: "Mateo Gutiérrez (11°C)",
            school: "IED San José",
            localidad: "Suroriente",
            type: "Deserción / Ausentismo",
            risk: "Bajo",
            date: "Hace 3 horas",
            status: "Resuelto",
            notes: "Se coordinó visita domiciliaria y el estudiante se reintegró hoy."
        }
    ];

    let alerts = JSON.parse(localStorage.getItem('alerts')) || DEFAULT_ALERTS;
    if (!localStorage.getItem('alerts')) {
        localStorage.setItem('alerts', JSON.stringify(alerts));
    }

    // Cargar base de datos de instituciones para asociar el psicólogo asignado
    let institutions = JSON.parse(localStorage.getItem('institutions')) || [];

    // ==========================================================
    // 2. CAPTURA DE COMPONENTES DEL DOM
    // ==========================================================
    const alertsTableBody = document.getElementById('alertsTableBody');
    const searchInput = document.getElementById('searchInput');
    const filterRisk = document.getElementById('filterRisk');
    const filterType = document.getElementById('filterType');
    const btnResetFilters = document.getElementById('btnResetFilters');

    // KPIs / Tarjetas
    const txtKpiTotal = document.getElementById('txtKpiTotal');
    const txtKpiCritical = document.getElementById('txtKpiCritical');
    const txtKpiInProcess = document.getElementById('txtKpiInProcess');
    const txtKpiResolved = document.getElementById('txtKpiResolved');

    // Modales y menús
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Modal Atender
    const attendModal = document.getElementById('attendModal');
    const attendForm = document.getElementById('attendForm');
    const attendRadicado = document.getElementById('attendRadicado');
    const attendSchool = document.getElementById('attendSchool');
    const attendStudent = document.getElementById('attendStudent');
    const selectStatus = document.getElementById('selectStatus');
    const notesFollowUp = document.getElementById('notesFollowUp');
    const attendIndex = document.getElementById('attendIndex');
    const closeAttendModal = document.getElementById('closeAttendModal');
    const btnCancelAttend = document.getElementById('btnCancelAttend');

    // Modal Compartir
    const shareModal = document.getElementById('shareModal');
    const shareForm = document.getElementById('shareForm');
    const shareIndex = document.getElementById('shareIndex');
    const shareSchoolName = document.getElementById('shareSchoolName');
    const psyStatusContainer = document.getElementById('psyStatusContainer');
    const sharePriority = document.getElementById('sharePriority');
    const shareMessage = document.getElementById('shareMessage');
    const closeShareModal = document.getElementById('closeShareModal');
    const btnCancelShare = document.getElementById('btnCancelShare');

    // ==========================================================
    // 3. CÁLCULO DINÁMICO DE KPIS (Tarjetas Superiores)
    // ==========================================================
    function updateKpis() {
        // Los KPIs se calculan sobre el set global de datos reales
        const total = alerts.length;
        const critical = alerts.filter(a => a.risk === "Alto / Critico").length;
        const inProcess = alerts.filter(a => a.status === "En Proceso").length;
        const resolved = alerts.filter(a => a.status === "Resuelto").length;

        txtKpiTotal.innerText = total;
        txtKpiCritical.innerText = critical;
        txtKpiInProcess.innerText = inProcess;
        txtKpiResolved.innerText = resolved;
    }

    // ==========================================================
    // 4. RENDERIZACIÓN DE LA TABLA DE ALERTAS
    // ==========================================================
    function renderTable() {
        alertsTableBody.innerHTML = '';

        if (alerts.length === 0) {
            alertsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: #a0aec0;">No hay alertas cargadas.</td></tr>`;
            return;
        }

        alerts.forEach((alertData, index) => {
            // Clases de badge para Riesgo
            let riskClass = 'bajo';
            if (alertData.risk === 'Alto / Critico') riskClass = 'alto';
            if (alertData.risk === 'Medio') riskClass = 'medio';

            // Clases de badge para Estado
            let statusClass = 'pendiente';
            if (alertData.status === 'En Proceso') statusClass = 'proceso';
            if (alertData.status === 'Resuelto') statusClass = 'resuelto';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${alertData.radicado}</strong></td>
                <td>
                    <strong>${alertData.school}</strong><br>
                    <span class="school-subtext">Sede Principal - ${alertData.localidad}</span>
                </td>
                <td>${alertData.type}</td>
                <td><span class="badge-risk ${riskClass}">${alertData.risk}</span></td>
                <td>${alertData.date}</td>
                <td><span class="badge-status ${statusClass}">${alertData.status}</span></td>
                <td>
                    <div class="actions-btn-group">
                        <button class="btn-circle-action attend-btn" data-index="${index}" title="Atender Caso"><i class="fa-solid fa-folder-open"></i></button>
                        <button class="btn-circle-action share-btn" data-index="${index}" title="Compartir a Psicóloga"><i class="fa-solid fa-share-nodes"></i></button>
                    </div>
                </td>
            `;
            alertsTableBody.appendChild(row);
        });

        updateKpis();
        applyFilters();
    }

    // ==========================================================
    // 5. MOTOR DE FILTRADO COMBINADO
    // ==========================================================
    function applyFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const riskVal = filterRisk.value;
        const typeVal = filterType.value;

        const rows = alertsTableBody.querySelectorAll('tr');

        rows.forEach((row, i) => {
            const data = alerts[i];
            if (!data) return;

            const matchQuery = data.radicado.toLowerCase().includes(query) ||
                               data.school.toLowerCase().includes(query) ||
                               data.student.toLowerCase().includes(query);

            const matchRisk = riskVal === "" || data.risk === riskVal;
            const matchType = typeVal === "" || data.type === typeVal;

            if (matchQuery && matchRisk && matchType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', applyFilters);
    filterRisk.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);

    // Botón de Restablecer Historial Completo
    btnResetFilters.addEventListener('click', () => {
        searchInput.value = '';
        filterRisk.value = '';
        filterType.value = '';
        applyFilters();
    });

    // ==========================================================
    // 6. EVENTOS DE MODAL 1: ATENDER CASO
    // ==========================================================
    const closeAttend = () => { attendModal.classList.remove('show'); };
    closeAttendModal.addEventListener('click', closeAttend);
    btnCancelAttend.addEventListener('click', closeAttend);

    attendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(attendIndex.value);

        // Modificamos el estado y la nota del registro
        alerts[index].status = selectStatus.value;
        alerts[index].notes = notesFollowUp.value;

        // Guardar cambios en el almacenamiento persistente
        localStorage.setItem('alerts', JSON.stringify(alerts));
        renderTable();
        closeAttend();
    });

    // ==========================================================
    // 7. EVENTOS DE MODAL 2: COMPARTIR CON PSICÓLOGA
    // ==========================================================
    const closeShare = () => { shareModal.classList.remove('show'); };
    closeShareModal.addEventListener('click', closeShare);
    btnCancelShare.addEventListener('click', closeShare);

    shareForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(shareIndex.value);
        const priority = sharePriority.value;
        const message = shareMessage.value;

        alert(`📬 Expediente derivado correctamente:\n• Caso: ${alerts[index].radicado}\n• Prioridad: ${priority}\n• Mensaje: "${message}"`);
        
        closeShare();
    });

    // ==========================================================
    // 8. DELEGACIÓN DE CLICS EN ACCIONES DE LA TABLA
    // ==========================================================
    alertsTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-circle-action');
        if (!button) return;

        const index = button.getAttribute('data-index');
        const caseData = alerts[index];

        // Acción: Atender Caso (Modificar estado)
        if (button.classList.contains('attend-btn')) {
            attendIndex.value = index;
            attendRadicado.innerText = caseData.radicado;
            attendSchool.innerText = caseData.school;
            attendStudent.innerText = caseData.student;
            selectStatus.value = caseData.status;
            notesFollowUp.value = caseData.notes || "";

            attendModal.classList.add('show');
        }

        // Acción: Compartir a Psicóloga (Asignación automática desde instituciones)
        if (button.classList.contains('share-btn')) {
            shareIndex.value = index;
            shareSchoolName.value = caseData.school;
            shareMessage.value = `Buen día. Derivo este caso de prioridad alta del estudiante ${caseData.student} para su valoración profesional.`;

            // Encontrar si esa escuela tiene psicóloga en la base de datos local
            const linkedSchool = institutions.find(i => i.name.toLowerCase() === caseData.school.toLowerCase());
            
            psyStatusContainer.innerHTML = '';
            
            if (linkedSchool && linkedSchool.psicologo.trim() !== "") {
                psyStatusContainer.style.backgroundColor = "rgba(46, 204, 113, 0.12)";
                psyStatusContainer.style.color = "var(--green-color)";
                psyStatusContainer.innerHTML = `<i class="fa-solid fa-user-doctor"></i> Dra. ${linkedSchool.psicologo} (Asignada)`;
            } else {
                psyStatusContainer.style.backgroundColor = "rgba(231, 76, 60, 0.12)";
                psyStatusContainer.style.color = "var(--red-color)";
                psyStatusContainer.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> No hay psicóloga asignada a esta institución en este momento.`;
            }

            shareModal.classList.add('show');
        }
    });

    // ==========================================================
    // 9. RESPONSIVIDAD Y MENÚS FLOTANTES (Perfil y Hamburguesa)
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

    // Render Inicial
    renderTable();
});