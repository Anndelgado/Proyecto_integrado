document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. BASE DE DATOS LOCALIZADA PARA ESTADÍSTICAS
    // ==========================================================
    const STATS_DATA = {
        Todas: {
            students: 1420,
            trend: [140, 190, 230, 180, 280, 380], // Casos reales correspondientes al gráfico de tu captura
            types: [55, 30, 15], // [Acoso Escolar, Riesgo Psicosocial, Deserción]
            table: [
                { school: "IED La Concepción", localidad: "Riomar", total: 38, critical: 12, index: 85 },
                { school: "IED Jorge Robledo", localidad: "Suroccidente", total: 29, critical: 5, index: 60 },
                { school: "IED San José", localidad: "Suroriente", total: 14, critical: 0, index: 25 }
            ]
        },
        Riomar: {
            students: 540,
            trend: [40, 70, 90, 50, 110, 160],
            types: [40, 45, 15],
            table: [
                { school: "IED La Concepción", localidad: "Riomar", total: 38, critical: 12, index: 85 }
            ]
        },
        Suroccidente: {
            students: 610,
            trend: [70, 80, 100, 90, 120, 150],
            types: [60, 20, 20],
            table: [
                { school: "IED Jorge Robledo", localidad: "Suroccidente", total: 29, critical: 5, index: 60 }
            ]
        },
        Suroriente: {
            students: 270,
            trend: [30, 40, 40, 40, 50, 70],
            types: [50, 30, 20],
            table: [
                { school: "IED San José", localidad: "Suroriente", total: 14, critical: 0, index: 25 }
            ]
        }
    };

    // Variables globales para instancias de gráficos
    let lineChartInstance = null;
    let pieChartInstance = null;

    // Elementos del DOM
    const txtKpiStudents = document.getElementById('txtKpiStudents');
    const filterPeriod = document.getElementById('filterPeriod');
    const filterLocalidad = document.getElementById('filterLocalidad');
    const btnRefreshStats = document.getElementById('btnRefreshStats');
    const statsTableBody = document.getElementById('statsTableBody');

    // Menús e interfaz responsive
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // ==========================================================
    // 2. INICIALIZACIÓN DE GRÁFICOS (Chart.js)
    // ==========================================================
    function initCharts() {
        const lineCtx = document.getElementById('lineChartTendency').getContext('2d');
        const pieCtx = document.getElementById('pieChartTypes').getContext('2d');

        // Configuración de la línea con gradiente sutil exactamente igual al de tu diseño
        const greenGradient = lineCtx.createLinearGradient(0, 0, 0, 280);
        greenGradient.addColorStop(0, 'rgba(46, 204, 113, 0.3)');
        greenGradient.addColorStop(1, 'rgba(46, 204, 113, 0.01)');

        lineChartInstance = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Casos Totales',
                    data: STATS_DATA.Todas.trend,
                    borderColor: '#2ecc71',
                    borderWidth: 3,
                    backgroundColor: greenGradient,
                    fill: true,
                    tension: 0.4, // Curvatura idéntica a la captura
                    pointBackgroundColor: '#2ecc71',
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 100,
                        max: 400,
                        ticks: { stepSize: 50 },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });

        // Gráfico de Tipologías (Dona con colores unificados)
        pieChartInstance = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Acoso Escolar', 'Riesgo Psicosocial', 'Deserción / Ausentismo'],
                datasets: [{
                    data: STATS_DATA.Todas.types,
                    backgroundColor: ['#e74c3c', '#f1c40f', '#3498db'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: { size: 11 }
                        }
                    }
                },
                cutout: '65%' // Aspecto de dona exacto
            }
        });
    }

    // ==========================================================
    // 3. ACTUALIZACIÓN DINÁMICA DE LA INTERFAZ
    // ==========================================================
    function updateStats() {
        const localidad = filterLocalidad.value;
        const currentData = STATS_DATA[localidad] || STATS_DATA.Todas;

        // Efecto visual de actualización sutil
        txtKpiStudents.style.opacity = 0.3;
        setTimeout(() => {
            // Actualizar KPI de Estudiantes Atendidos
            txtKpiStudents.innerText = currentData.students.toLocaleString();
            txtKpiStudents.style.opacity = 1;
        }, 150);

        // Actualizar datos del Gráfico Lineal
        lineChartInstance.data.datasets[0].data = currentData.trend;
        lineChartInstance.update();

        // Actualizar datos del Gráfico de Tipologías
        pieChartInstance.data.datasets[0].data = currentData.types;
        pieChartInstance.update();

        // Actualizar la Tabla
        renderStatsTable(currentData.table);
    }

    function renderStatsTable(tableData) {
        statsTableBody.innerHTML = '';

        if (!tableData || tableData.length === 0) {
            statsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--secondary-color);">No hay datos para esta localidad</td></tr>`;
            return;
        }

        tableData.forEach(row => {
            // Selector de clase e índice de riesgo
            let riskClass = 'low';
            if (row.index > 75) riskClass = 'critical';
            else if (row.index > 40) riskClass = 'medium';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${row.school}</strong></td>
                <td>Sede Principal - ${row.localidad}</td>
                <td><strong>${row.total}</strong></td>
                <td><span style="color: ${row.critical > 0 ? 'var(--red-color)' : 'var(--secondary-color)'}; font-weight: bold;">${row.critical} Críticos</span></td>
                <td>
                    <div class="risk-bar-wrapper">
                        <div class="risk-bar-container">
                            <div class="risk-bar-fill ${riskClass}" style="width: ${row.index}%"></div>
                        </div>
                        <span class="risk-percentage">${row.index}%</span>
                    </div>
                </td>
            `;
            statsTableBody.appendChild(tr);
        });
    }

    // Eventos de interacción
    btnRefreshStats.addEventListener('click', () => {
        const originalText = btnRefreshStats.innerHTML;
        btnRefreshStats.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Cargando...`;
        btnRefreshStats.disabled = true;

        setTimeout(() => {
            updateStats();
            btnRefreshStats.innerHTML = originalText;
            btnRefreshStats.disabled = false;
        }, 600);
    });

    filterLocalidad.addEventListener('change', updateStats);
    filterPeriod.addEventListener('change', updateStats);

    // ==========================================================
    // 4. RESPONSIVIDAD Y MENÚS FLOTANTES (Perfil y Hamburguesa)
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

    // Carga inicial de datos
    initCharts();
    renderStatsTable(STATS_DATA.Todas.table);
});