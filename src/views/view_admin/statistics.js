document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE COMPONENTES DE FILTROS Y BOTONES
    // ==========================================================
    const selectores = document.querySelectorAll('.filter-select');
    const selectPeriodo = selectores[0];
    const selectLocalidad = selectores[1];
    const btnActualizar = document.querySelector('.btn-refresh');

    // Variables globales para guardar las instancias de los gráficos (y poder actualizarlos luego)
    let graficoTendencia;
    let graficoCategorias;

    // ==========================================================
    // 2. INICIALIZACIÓN DEL GRÁFICO 1: TENDENCIA MENSUAL (ÁREA/LÍNEA)
    // ==========================================================
    const ctxTendencia = document.getElementById('trendsChart');
    if (ctxTendencia) {
        graficoTendencia = new Chart(ctxTendencia, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Incidencias Reportadas',
                    data: [140, 190, 230, 180, 290, 380],
                    borderColor: '#2ecc71', // Verde éxito para la línea
                    backgroundColor: 'rgba(46, 204, 113, 0.15)', // Relleno suave abajo
                    fill: true, // Activa el efecto de área sombreada
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Permite que se estire bien en tu CSS grid
                plugins: { legend: { display: false } }
            }
        });
    }

    // ==========================================================
    // 3. INICIALIZACIÓN DEL GRÁFICO 2: TIPOLOGÍAS FRECUENTES (DONA)
    // ==========================================================
    const ctxCategorias = document.getElementById('categoriesChart');
    if (ctxCategorias) {
        graficoCategorias = new Chart(ctxCategorias, {
            type: 'doughnut',
            data: {
                labels: ['Acoso Escolar', 'Riesgo Psicosocial', 'Deserción / Ausentismo'],
                datasets: [{
                    data: [45, 35, 20], // Porcentajes proporcionales (suman 100%)
                    backgroundColor: ['#e74c3c', '#f1c40f', '#3498db'], // Rojo, Amarillo y Azul
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // ==========================================================
    // 4. LÓGICA INTERACTIVA: SIMULACIÓN DE ACTUALIZACIÓN DE DATOS
    // ==========================================================
    function recargarPanelAnalitico() {
        const periodo = selectPeriodo.value;
        const localidad = selectLocalidad.value;

        // Añadimos un efecto visual al botón rotando su icono por un segundo
        const icono = btnActualizar.querySelector('i');
        if (icono) icono.classList.add('fa-spin');

        setTimeout(() => {
            if (icono) icono.classList.remove('fa-spin');

            // Generamos datos aleatorios para simular que la base de datos respondió al filtro
            const nuevosDatosTendencia = Array.from({length: 6}, () => Math.floor(Math.random() * 300) + 100);
            const nuevosDatosDona = [
                Math.floor(Math.random() * 50) + 10,
                Math.floor(Math.random() * 40) + 10,
                Math.floor(Math.random() * 30) + 5
            ];

            // Inyectamos los nuevos valores dentro de las instancias de los gráficos
            if (graficoTendencia) {
                graficoTendencia.data.datasets[0].data = nuevosDatosTendencia;
                graficoTendencia.update(); // Redibuja el gráfico con animación fluida
            }

            if (graficoCategorias) {
                graficoCategorias.data.datasets[0].data = nuevosDatosDona;
                graficoCategorias.update();
            }

            alert(`📊 Panel actualizado con éxito para el periodo [${periodo || 'Global'}] en la zona [${localidad || 'Distrital'}].`);
        }, 800);
    }

    // Escuchamos el botón "Actualizar"
    if (btnActualizar) {
        btnActualizar.addEventListener('click', recargarPanelAnalitico);
    }


    // ==========================================================
    // 5. ACCIÓN DE LA TABLA INFERIOR: BOTÓN INSPECCIONAR
    // ==========================================================
    const tablaIeds = document.querySelector('table tbody');
    if (tablaIeds) {
        tablaIeds.addEventListener('click', (event) => {
            const boton = event.target.closest('.btn-table-action');
            if (!boton) return;

            const fila = boton.closest('tr');
            const nombreIED = fila.querySelector('strong').innerText;
            const alertasTotales = fila.cells[2].innerText;

            alert(`🔍 Abriendo auditoría de datos detallada de la ${nombreIED}.\nEsta sede registra un consolidado de ${alertasTotales} alertas activas.`);
        });
    }
});