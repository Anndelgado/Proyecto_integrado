document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE COMPONENTES DEL FORMULARIO Y LA TABLA
    // ==========================================================
    const selectTipoDoc = document.getElementById('report-type');
    const inputFechaInicio = document.getElementById('date-start');
    const inputFechaEnd = document.getElementById('date-end');
    const selectLocalidad = document.getElementById('filter-locality');
    const selectIed = document.getElementById('filter-ied');

    const btnPdf = document.querySelector('.btn-pdf');
    const btnExcel = document.querySelector('.btn-excel');
    const btnProgramar = document.querySelector('.btn-secondary-action');
    const tablaCuerpo = document.querySelector('table tbody');

    // ==========================================================
    // 2. FUNCIÓN PARA DISPARAR LA GENERACIÓN DE UN DOCUMENTO
    // ==========================================================
    function generarReporte(formato) {
        // Capturamos los valores seleccionados en tiempo real
        const tipoTexto = selectTipoDoc.options[selectTipoDoc.selectedIndex].text;
        const localidadText = selectLocalidad.options[selectLocalidad.selectedIndex].text;
        const iedText = selectIed.options[selectIed.selectedIndex].text;
        
        // Validamos que las fechas tengan consistencia básica
        if (!inputFechaInicio.value || !inputFechaEnd.value) {
            alert("⚠️ Por favor, selecciona un rango de fechas válido.");
            return;
        }

        // Animación visual simulando la carga del procesamiento
        const botonActivo = formato === 'pdf' ? btnPdf : btnExcel;
        const iconoOriginal = botonActivo.innerHTML;
        botonActivo.disabled = true;
        botonActivo.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando...`;

        setTimeout(() => {
            // Restauramos el botón
            botonActivo.disabled = false;
            botonActivo.innerHTML = iconoOriginal;

            // Creamos un nombre de archivo ficticio limpio basado en el formato y la selección
            const timestamp = Math.floor(Date.now() / 100000);
            const ext = formato === 'pdf' ? 'pdf' : 'xlsx';
            const iconClass = formato === 'pdf' ? 'fa-file-pdf file-icon-pdf' : 'fa-file-excel file-icon-excel';
            const nombreArchivo = `rep_${selectTipoDoc.value}_${timestamp}.${ext}`;

            // Obtenemos la fecha y hora actual formateada en tiempo real
            const ahora = new Date();
            const fechaFormateada = `${ahora.getDate().toString().padStart(2, '0')}/${(ahora.getMonth() + 1).toString().padStart(2, '0')}/${ahora.getFullYear()} - ${ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // --- INSERCIÓN DINÁMICA DE LA NUEVA FILA EN LA TABLA ---
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${fechaFormateada}</td>
                <td><i class="fa-solid ${iconClass}"></i> <code>${nombreArchivo}</code></td>
                <td>${tipoTexto.split('(')[0].trim()}</td>
                <td>Admin_Sistemas</td>
                <td>${(Math.random() * (3.5 - 0.5) + 0.5).toFixed(1)} MB</td>
                <td><button class="btn-table-download"><i class="fa-solid fa-cloud-arrow-down"></i> Bajar</button></td>
            `;

            // Insertamos la nueva descarga al principio de la tabla (arriba de las anteriores)
            if (tablaCuerpo) {
                tablaCuerpo.insertBefore(nuevaFila, tablaCuerpo.firstChild);
            }

            alert(`🚀 ¡Reporte Generado con éxito!\nFiltros aplicados:\n📍 Zona: ${localidadText}\n🏫 Sede: ${iedText}\nEl documento se ha indexado en el historial de auditoría.`);
        }, 1500); // 1.5 segundos de retraso para dar sensación de carga real
    }

    // Escuchadores de los botones de exportación
    if (btnPdf) btnPdf.addEventListener('click', () => generarReporte('pdf'));
    if (btnExcel) btnExcel.addEventListener('click', () => generarReporte('excel'));


    // ==========================================================
    // 3. LOGICA PARA AGREGAR REPORTES AUTOMATIZADOS (PROGRAMACIÓN)
    // ==========================================================
    if (btnProgramar) {
        btnProgramar.addEventListener('click', () => {
            const titulo = prompt("Ingresa el título de la nueva alerta automatizada:");
            if (!titulo) return;

            const correo = prompt("Ingresa el correo institucional destino:");
            if (!correo || !correo.includes('@')) {
                alert("❌ Correo inválido o proceso cancelado.");
                return;
            }

            // Capturamos el contenedor de la lista de envíos automáticos
            const contenedorLista = document.querySelector('.schedule-list');
            
            if (contenedorLista) {
                const nuevoItem = document.createElement('div');
                nuevoItem.className = 'schedule-item'; // Clase de estilo de tu bloque CSS
                nuevoItem.innerHTML = `
                    <div class="schedule-info">
                        <h4>${titulo}</h4>
                        <p>Frecuencia: <span class="badge">Cada Mes (Día 1) 7:00 AM</span></p>
                        <p class="destinatary">Para: ${correo}</p>
                    </div>
                    <div class="schedule-toggle">
                        <span class="status-dot online"></span> Activo
                    </div>
                `;
                contenedorLista.appendChild(nuevoItem);
                alert(`⏰ Se ha configurado una tarea cronometrada para enviar automáticamente: "${titulo}" al correo ${correo}.`);
            }
        });
    }


    // ==========================================================
    // 4. LÓGICA DE BOTONES "BAJAR" EN EL HISTORIAL (Delegación)
    // ==========================================================
    if (tablaCuerpo) {
        tablaCuerpo.addEventListener('click', (event) => {
            const boton = event.target.closest('.btn-table-download');
            if (!boton) return;

            const fila = boton.closest('tr');
            const nombreArchivo = fila.querySelector('code').innerText;

            alert(`📥 Iniciando la descarga directa del servidor para el archivo comprimido:\n[ ${nombreArchivo} ]`);
        });
    }
});