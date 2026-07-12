document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE COMPONENTES
    // ==========================================================
    const buscador = document.querySelector('.search-input');
    const selectores = document.querySelectorAll('.filter-select');
    const selectLocalidad = selectores[0]; 
    const selectRiesgo = selectores[1];    
    const filasInstituciones = document.querySelectorAll('table tbody tr');
    const btnRegistrar = document.querySelector('.btn-primary');

    // CAPTURA DE LOS 4 RECUADROS SUPERIORES
    const valorInstituciones = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const valorSedesCriticas = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const valorZonaRiesgo = document.querySelector('.stat-card:nth-child(3) .stat-value');
    const valorDocentes = document.querySelector('.stat-card:nth-child(4) .stat-value');

    if (!buscador || !selectLocalidad || !selectRiesgo || filasInstituciones.length === 0) return;


    // ==========================================================
    // 2. LÓGICA DE CONTADORES AUTOMÁTICOS (RECUADROS SUPERIORES)
    // ==========================================================
    function calcularEstadisticasInstituciones() {
        let totalSedes = filasInstituciones.length; // Cuenta cuántas filas físicas hay en la tabla
        let sedesCriticas = 0;
        let totalDocentes = 0;
        
        // Objeto para contar cuántas alertas hay por localidad y descubrir cuál es la peor
        let mapaZonas = {}; 

        filasInstituciones.forEach(fila => {
            // A. Contar Sedes Críticas mirando si existe el badge de alertas críticas
            const tieneCriticas = fila.querySelector('.alert-critica');
            if (tieneCriticas) {
                sedesCriticas++;
            }

            // B. Sumar Docentes Vinculados (está en la cuarta columna, celda número 3)
            const textoDocentes = fila.cells[3].querySelector('strong').innerText;
            totalDocentes += parseInt(textoDocentes) || 0; // Convertimos el texto "42" a número real

            // C. Rastrear Zona de Mayor Riesgo (Localidades)
            const localidad = fila.cells[1].innerText.trim();
            if (tieneCriticas) {
                // Si la sede es crítica, le sumamos peso a esa localidad en nuestro mapa
                mapaZonas[localidad] = (mapaZonas[localidad] || 0) + 1;
            }
        });

        // Algoritmo matemático para descubrir qué localidad se repite más en estado crítico
        let zonaMayorRiesgo = "Ninguna";
        let maxCriticas = 0;
        for (let zona in mapaZonas) {
            if (mapaZonas[zona] > maxCriticas) {
                maxCriticas = mapaZonas[zona];
                zonaMayorRiesgo = zona;
            }
        }
        // Si no hay ninguna crítica en toda la tabla, usamos la que viene por defecto en tu diseño
        if (zonaMayorRiesgo === "Ninguna") zonaMayorRiesgo = "Suroccidente";

        // INYECTAMOS LOS DATOS REALES EN LAS TARJETAS HTML
        if (valorInstituciones) valorInstituciones.innerText = totalSedes;
        if (valorSedesCriticas) valorSedesCriticas.innerText = sedesCriticas;
        if (valorZonaRiesgo) valorZonaRiesgo.innerText = zonaMayorRiesgo;
        if (valorDocentes) valorDocentes.innerText = totalDocentes.toLocaleString(); // Formatea con puntos (ej: 1.124)
    }


    // ==========================================================
    // 3. FUNCIÓN DE FILTRADO COMBINADO
    // ==========================================================
    function filtrarInstituciones() {
        const textoBusqueda = buscador.value.toLowerCase().trim();
        const localidadSeleccionada = selectLocalidad.value.toLowerCase();
        const riesgoSeleccionado = selectRiesgo.value.toLowerCase();

        filasInstituciones.forEach(fila => {
            const textoFilaCompleto = fila.innerText.toLowerCase();
            const textoLocalidad = fila.cells[1].innerText.toLowerCase();
            const semaforo = fila.querySelector('.alert-semaphore');
            
            const cumpleBuscador = textoFilaCompleto.includes(textoBusqueda);
            const cumpleLocalidad = localidadSeleccionada === "" || textoLocalidad.includes(localidadSeleccionada);

            let cumpleRiesgo = false;
            if (riesgoSeleccionado === "") {
                cumpleRiesgo = true; 
            } else if (riesgoSeleccionado === "critico") {
                if (semaforo.querySelector('.alert-critica')) cumpleRiesgo = true;
            } else if (riesgoSeleccionado === "moderado") {
                const tieneMedias = semaforo.querySelector('.alert-media');
                const tieneCriticas = semaforo.querySelector('.alert-critica');
                if (tieneMedias && !tieneCriticas) cumpleRiesgo = true;
            } else if (riesgoSeleccionado === "estable") {
                if (semaforo.querySelector('.alert-estable')) cumpleRiesgo = true;
            }

            if (cumpleBuscador && cumpleLocalidad && cumpleRiesgo) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }

    // ==========================================================
    // 4. ESCUCHADORES DE EVENTOS
    // ==========================================================
    buscador.addEventListener('input', filtrarInstituciones);
    selectLocalidad.addEventListener('change', filtrarInstituciones);
    selectRiesgo.addEventListener('change', filtrarInstituciones);


    // ==========================================================
    // 5. LÓGICA DE BOTONES DE ACCIÓN (Delegación)
    // ==========================================================
    document.querySelector('table tbody').addEventListener('click', (event) => {
        const boton = event.target.closest('.btn-action');
        if (!boton) return;

        const fila = boton.closest('tr');
        const nombreIED = fila.querySelector('strong').innerText;

        if (boton.classList.contains('rapid-assign')) {
            if (fila.innerText.toLowerCase().includes('sin asignar')) {
                const nuevaAsignacion = prompt(`La escuela ${nombreIED} no tiene psicóloga.\nEscribe el nombre de la especialista:`);
                if (nuevaAsignacion) {
                    alert(`✅ Éxito: ${nuevaAsignacion} asignada a ${nombreIED}.`);
                }
            } else {
                alert(`👥 Abriendo reasignación para: ${nombreIED}`);
            }
        } 
        else if (boton.classList.contains('view-details')) {
            alert(`🔍 Cargando expediente histórico de la ${nombreIED}.`);
        } 
        else {
            alert(`📝 Modificando datos básicos de la ${nombreIED}.`);
        }
    });

    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', () => {
            alert("🏢 Redireccionando al formulario de nueva institución.");
        });
    }

    // ==========================================================
    // 6. INICIALIZACIÓN AUTOMÁTICA
    // ==========================================================
    // Calculamos las estadísticas superiores automáticamente al cargar la página
    calcularEstadisticasInstituciones();
});