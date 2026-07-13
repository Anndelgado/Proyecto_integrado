// Hacemos que la función switchTab sea global para que los atributos 'onclick' del HTML la sigan encontrando sin problemas
window.switchTab = function(event, tabId) {
    // 1. Ocultar todos los bloques de contenido de las pestañas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. Quitar la clase 'active' de todos los botones de pestañas
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Mostrar el bloque de contenido seleccionado
    const panelObjetivo = document.getElementById(tabId);
    if (panelObjetivo) panelObjetivo.classList.add('active');

    // 4. Marcar el botón clickeado como activo
    event.currentTarget.classList.add('active');
};

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE BOTONES DE ACCIÓN GENERALES
    // ==========================================================
    const btnGuardar = document.querySelector('.btn-save');
    const btnRestaurar = document.querySelector('.btn-restore');

    // Objeto temporal que simula el estado inicial de la Base de Datos para restauraciones
    const valoresPorDefecto = {
        'tab-alertas': { horasAtencion: 24, horasEscalado: 48, notificarEmail: true },
        'tab-seguridad': { expiracion: "90", inactividad: "30", mfa: false },
        'tab-entidad': { nombre: "Alcaldía de Barranquilla - Secretaría Distrital de Educación", correo: "soporte.convive@barranquilla.gov.co", linea: "(605) 339-1000 ext. 452" }
    };

    // ==========================================================
    // 2. ACCIÓN: GUARDAR CONFIGURACIONES DE LA PESTAÑA ACTIVA
    // ==========================================================
    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => {
            // Buscamos cuál es la sub-vista que está visible actualmente
            const pestañaActiva = document.querySelector('.tab-content.active');
            const idActivo = pestañaActiva.id;

            // Cambiamos el estado visual del botón para indicar procesamiento en el servidor
            const textoOriginal = btnGuardar.innerHTML;
            btnGuardar.disabled = true;
            btnGuardar.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sincronizando...`;

            setTimeout(() => {
                btnGuardar.disabled = false;
                btnGuardar.innerHTML = textoOriginal;

                // Validación específica en caliente si el usuario está guardando "Datos de la Entidad"
                if (idActivo === 'tab-entidad') {
                    const correoInput = pestañaActiva.querySelector('input[type="email"]').value;
                    if (!correoInput.includes('@') || !correoInput.includes('.')) {
                        alert("Error de validación: El formato del correo institucional de soporte no es válido.");
                        return;
                    }
                }

                alert("💾 ¡Éxito! Las preferencias del sistema han sido guardadas y aplicadas de forma global en los servidores de Barranquilla Convive.");
            }, 1000);
        });
    }

    // ==========================================================
    // 3. ACCIÓN: RESTAURAR VALORES DE FÁBRICA
    // ==========================================================
    if (btnRestaurar) {
        btnRestaurar.addEventListener('click', () => {
            const pestañaActiva = document.querySelector('.tab-content.active');
            const idActivo = pestañaActiva.id;

            // Si la pestaña de roles está activa, no hace falta restaurar inputs manuales
            if (idActivo === 'tab-roles') {
                alert("👥 Los privilegios de la Matriz de Roles están regidos por decretos distritales y no se pueden alterar.");
                return;
            }

            const confirmar = confirm("⚠️ ¿Estás seguro de que deseas restablecer los parámetros de esta pestaña a los valores originales del sistema?");
            if (!confirmar) return;

            // Procesamos la restauración inyectando los datos del objeto inicial en el DOM
            if (idActivo === 'tab-alertas') {
                const inputs = pestañaActiva.querySelectorAll('input[type="number"]');
                inputs[0].value = valoresPorDefecto['tab-alertas'].horasAtencion;
                inputs[1].value = valoresPorDefecto['tab-alertas'].horasEscalado;
                pestañaActiva.querySelector('#notify-email').checked = valoresPorDefecto['tab-alertas'].notificarEmail;
            } 
            else if (idActivo === 'tab-seguridad') {
                const selects = pestañaActiva.querySelectorAll('select');
                selects[0].value = valoresPorDefecto['tab-seguridad'].expiracion;
                selects[1].value = valoresPorDefecto['tab-seguridad'].inactividad;
                pestañaActiva.querySelector('#mfa-auth').checked = valoresPorDefecto['tab-seguridad'].mfa;
            } 
            else if (idActivo === 'tab-entidad') {
                pestañaActiva.querySelector('input[type="text"]').value = valoresPorDefecto['tab-entidad'].nombre;
                pestañaActiva.querySelector('input[type="email"]').value = valoresPorDefecto['tab-entidad'].correo;
                pestañaActiva.querySelectorAll('input')[2].value = valoresPorDefecto['tab-entidad'].linea; // Captura la extensión telefónica
            }

            alert("🔄 Valores reestablecidos con éxito en el panel local.");
        });
    }
});