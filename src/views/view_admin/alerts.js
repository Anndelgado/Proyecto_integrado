document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE COMPONENTES DEL DOM
    // ==========================================================
    const buscador = document.querySelector('.search-input');
    const selectores = document.querySelectorAll('.filter-select');
    const selectRiesgo = selectores[0]; // Primer selector: Nivel de Riesgo
    const selectTipo = selectores[1];   // Segundo selector: Tipo de Alerta
    const filasAlertas = document.querySelectorAll('table tbody tr');
    const btnHistorial = document.querySelector('.btn-primary');

    // Tarjetas contadoras superiores
    const valorTotales = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const valorCriticas = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const valorRevision = document.querySelector('.stat-card:nth-child(3) .stat-value');
    const valorResueltos = document.querySelector('.stat-card:nth-child(4) .stat-value');

    if (!buscador || !selectRiesgo || !selectTipo || filasAlertas.length === 0) return;


    // ==========================================================
    // 2. MOTOR DE CÁLCULO DE CONTADORES SUPERIORES
    // ==========================================================
    function calcularEstadisticasAlertas() {
        let totales = filasAlertas.length; // El número de filas físicas reales en la tabla
        let criticas = 0;
        let enRevision = 0;
        let resueltos = 0;

        filasAlertas.forEach(fila => {
            // Evaluamos el riesgo (mirando el texto de la etiqueta badge con clase que empiece por risk-)
            const textoRiesgo = fila.querySelector('[class*="risk-"]').innerText.toLowerCase();

            // Evaluamos el estado (mirando la clase del badge-status)
            const estadoBadge = fila.querySelector('.badge-status');

            // Sumamos si el riesgo es alto/crítico
            if (textoRiesgo.includes('alto') || textoRiesgo.includes('crítico')) {
                criticas++;
            }

            // Validamos los estados según sus clases o texto
            if (estadoBadge.classList.contains('status-process') || estadoBadge.innerText.toLowerCase().includes('proceso')) {
                enRevision++;
            } else if (estadoBadge.classList.contains('status-resolved') || estadoBadge.innerText.toLowerCase().includes('resuelto')) {
                resueltos++;
            }
        });

        // Modificamos las tarjetas visuales con los resultados calculados
        if (valorTotales) valorTotales.innerText = totales;
        if (valorCriticas) valorCriticas.innerText = criticas;
        if (valorRevision) valorRevision.innerText = enRevision;
        if (valorResueltos) valorResueltos.innerText = resueltos;
    }


    // ==========================================================
    // 3. SISTEMA DE FILTRADO COMBINADO (Buscador + Selects)
    // ==========================================================
    function filtrarAlertas() {
        const textoBusqueda = buscador.value.toLowerCase().trim();
        const riesgoSeleccionado = selectRiesgo.value.toLowerCase();
        const tipoSeleccionado = selectTipo.value.toLowerCase();

        filasAlertas.forEach(fila => {
            const textoFilaCompleto = fila.innerText.toLowerCase();
            const textoRiesgo = fila.querySelector('[class*="risk-"]').innerText.toLowerCase();
            const textoTipoAlerta = fila.cells[2].innerText.toLowerCase(); // Tercera columna (index 2)

            // REGLA 1: Buscador de texto (Código, Institución o Localidad)
            const cumpleBuscador = textoFilaCompleto.includes(textoBusqueda);

            // REGLA 2: Filtro por Nivel de Riesgo
            const cumpleRiesgo = riesgoSeleccionado === "" || textoRiesgo.includes(riesgoSeleccionado);

            // REGLA 3: Filtro por Tipo de Alerta (Hacemos match cruzado con tus 'values' cortos)
            let cumpleTipo = false;
            // REGLA 3: Filtro por Tipo de Alerta

            if (tipoSeleccionado === "") {
                cumpleTipo = true; // Si no hay filtro, pasan todos
            } else if (tipoSeleccionado === "acoso" && (textoTipoAlerta.includes("acoso") || textoTipoAlerta.includes("bullying"))) {
                cumpleTipo = true;
            } else if (tipoSeleccionado === "psico" && (textoTipoAlerta.includes("psico") || textoTipoAlerta.includes("ansiedad"))) {
                cumpleTipo = true;
            } else if (tipoSeleccionado === "academico" && (textoTipoAlerta.includes("deserción") || textoTipoAlerta.includes("ausentismo") || textoTipoAlerta.includes("académico"))) {
                cumpleTipo = true;
            }

            // DECISIÓN FINAL: Ocultamos o mostramos la fila según los filtros
            if (cumpleBuscador && cumpleRiesgo && cumpleTipo) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }


    // ==========================================================
    // 4. ESCUCHADORES DE EVENTOS PARA FILTROS
    // ==========================================================
    buscador.addEventListener('input', filtrarAlertas);
    selectRiesgo.addEventListener('change', filtrarAlertas);
    selectTipo.addEventListener('change', filtrarAlertas);


    // ==========================================================
    // 5. ACCIONES DE FILA (Ver caso / Derivar)
    // ==========================================================
    document.querySelector('table tbody').addEventListener('click', (event) => {
        const boton = event.target.closest('.btn-action');
        if (!boton) return;

        const fila = boton.closest('tr');
        const codigoRadicado = fila.querySelector('td strong').innerText;
        const nombreColegio = fila.cells[1].querySelector('strong').innerText;

        // ACCIÓN A: Ver ficha/expediente detallado (Botón de la carpeta abierta)
        if (boton.classList.contains('view-case')) {
            alert(`📂 Abriendo bitácora técnica de evolución e intervenciones para el ${codigoRadicado} de la ${nombreColegio}.`);
        }
        // ACCIÓN B: Derivar / Compartir (Botón con nodos)
        else {
            const especialista = prompt(`Indique el nombre o código de la psicóloga orientadora para derivar el ${codigoRadicado}:`);
            if (especialista) {
                alert(`🚀 Éxito: El caso ${codigoRadicado} ha sido transferido al panel de atención de: ${especialista}.`);
            }
        }
    });

    // Botón Historial Completo
    if (btnHistorial) {
        btnHistorial.addEventListener('click', () => {
            alert("📊 Descargando bitácora general de folios históricos desde la base de datos.");
        });
    }


    // ==========================================================
    // 6. INICIALIZACIÓN AUTOMÁTICA
    // ==========================================================
    calcularEstadisticasAlertas();
});