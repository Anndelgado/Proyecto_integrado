document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. CAPTURA DE COMPONENTES DE LA INTERFAZ
    // ==========================================================
    const buscador = document.querySelector('.search-input');
    const selectores = document.querySelectorAll('.filter-select');
    const selectRol = selectores[0];    
    const selectColegio = selectores[1]; 
    const filasUsuarios = document.querySelectorAll('table tbody tr');

    // Nuevos componentes capturados para estadísticas y acciones
    const btnCrearUsuario = document.querySelector('.btn-primary');
    const valorPsicologas = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const valorProfesores = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const valorPadres = document.querySelector('.stat-card:nth-child(3) .stat-value');
    const valorTotalGeneral = document.querySelector('.stat-card:nth-child(4) .stat-value');


    // ==========================================================
    // 2. LÓGICA DE CONTADORES (RECUADROS SUPERIORES)
    // ==========================================================
    function calcularEstadisticas() {
        let cuentaPsico = 0;
        let cuentaProfe = 0;
        let cuentaPadre = 0;
        let cuentaTotalActivosVisibles = 0;

        // Recorremos la tabla para contar cuántos usuarios hay en el HTML real
        filasUsuarios.forEach(fila => {
            const textoRol = fila.querySelector('.badge').innerText.toLowerCase();
            const estaInactivo = fila.querySelector('.status-dot').classList.contains('inactive');

            // Solo contamos para los perfiles específicos si están Activos (puedes ajustar esta regla si quieres contar todos)
            if (!estaInactivo) {
                if (textoRol.includes('psicóloga')) cuentaPsico++;
                if (textoRol.includes('profesor')) cuentaProfe++;
                if (textoRol.includes('padre')) cuentaPadre++;
            }
        });

        // El total general de la tabla física actual
        cuentaTotalActivosVisibles = filasUsuarios.length;

        // Inyectamos los números calculados directamente en las tarjetas del HTML
        if (valorPsicologas) valorPsicologas.innerText = cuentaPsico;
        if (valorProfesores) valorProfesores.innerText = cuentaProfe;
        if (valorPadres) valorPadres.innerText = cuentaPadre;
        if (valorTotalGeneral) valorTotalGeneral.innerText = cuentaTotalActivosVisibles;
    }


    // ==========================================================
    // 3. LÓGICA DE FILTRADO (Buscador y Selectores)
    // ==========================================================
    function filtrarUsuarios() {
        const textoBusqueda = buscador.value.toLowerCase().trim();
        const rolSeleccionado = selectRol.value.toLowerCase();
        const colegioSeleccionado = selectColegio.value.toLowerCase();

        filasUsuarios.forEach(fila => {
            const textoFilaCompleto = fila.innerText.toLowerCase();
            const textoRol = fila.querySelector('.badge').innerText.toLowerCase();
            const textoColegio = fila.cells[3].innerText.toLowerCase();

            const cumpleBuscador = textoFilaCompleto.includes(textoBusqueda);
            
            let cumpleRol = false;
            if (rolSeleccionado === "") {
                cumpleRol = true;
            } else if (rolSeleccionado === "admin" && textoRol.includes("rector")) {
                cumpleRol = true;
            } else if (rolSeleccionado === "psico" && textoRol.includes("psicóloga")) {
                cumpleRol = true;
            } else if (rolSeleccionado === "profe" && textoRol.includes("profesor")) {
                cumpleRol = true;
            } else if (rolSeleccionado === "padre" && textoRol.includes("padre")) {
                cumpleRol = true;
            }

            let terminoColegio = "";
            if (colegioSeleccionado === "ied1") terminoColegio = "concepción";
            if (colegioSeleccionado === "ied2") terminoColegio = "robledo";
            if (colegioSeleccionado === "ied3") terminoColegio = "san josé";
            
            const cumpleColegio = colegioSeleccionado === "" || textoColegio.includes(terminoColegio);

            if (cumpleBuscador && cumpleRol && cumpleColegio) {
                fila.style.display = ''; 
            } else {
                fila.style.display = 'none'; 
            }
        });
    }


    // ==========================================================
    // 4. LÓGICA DE BOTONES DE ACCIÓN (Cada Fila de Usuario)
    // ==========================================================
    
    // Escuchamos los clics en toda la tabla y detectamos qué botón exacto se presionó
    document.querySelector('table tbody').addEventListener('click', (event) => {
        // Buscamos el botón o el icono contenedor más cercano (.btn-action)
        const botonClickeado = event.target.closest('.btn-action');
        if (!botonClickeado) return; // Si hicieron clic fuera de un botón, ignoramos el evento

        // Obtenemos la fila completa 'tr' y el nombre del usuario de esa fila para personalizar la alerta
        const fila = botonClickeado.closest('tr');
        const nombreUsuario = fila.querySelector('strong').innerText;

        // ACCIÓN A: Cambiar contraseña (Detectamos por clase 'reset-pass')
        if (botonClickeado.classList.contains('reset-pass')) {
            alert(`🔑 Se ha enviado un enlace de restauración de contraseña al correo institucional de: ${nombreUsuario}`);
        }

        // ACCIÓN B: Desactivar usuario
        else if (botonClickeado.classList.contains('deactivate')) {
            const confirmar = confirm(`¿Estás seguro de que deseas desactivar la cuenta de ${nombreUsuario}?`);
            if (confirmar) {
                // Cambiamos el puntito visual a inactivo
                const puntoEstado = fila.querySelector('.status-dot');
                puntoEstado.className = 'status-dot inactive';
                
                // Modificamos el texto al lado del punto
                puntoEstado.nextSibling.textContent = ' Inactivo';
                
                // Transformamos el botón de desactivar a uno de activar dinámicamente
                botonClickeado.className = 'btn-action activate';
                botonClickeado.title = 'Activar';
                botonClickeado.innerHTML = '<i class="fa-solid fa-user-check"></i>';
                
                // Actualizamos los contadores superiores de inmediato
                calcularEstadisticas();
            }
        }

        // ACCIÓN C: Activar usuario (Por si estaba inactivo y se presiona 'user-check')
        else if (botonClickeado.classList.contains('activate')) {
            // Cambiamos el puntito a activo
            const puntoEstado = fila.querySelector('.status-dot');
            puntoEstado.className = 'status-dot active';
            puntoEstado.nextSibling.textContent = ' Activo';

            // Volvemos a poner el botón de desactivar
            botonClickeado.className = 'btn-action deactivate';
            botonClickeado.title = 'Desactivar';
            botonClickeado.innerHTML = '<i class="fa-solid fa-user-slash"></i>';

            calcularEstadisticas();
        }

        // ACCIÓN D: Editar Perfil (Cualquier botón de acción restante que no sea especial)
        else {
            alert(`📝 Abriendo formulario de edición para el perfil de: ${nombreUsuario}`);
        }
    });


    // ==========================================================
    // 5. ACCIÓN DE CREAR NUEVO USUARIO
    // ==========================================================
    if (btnCrearUsuario) {
        btnCrearUsuario.addEventListener('click', () => {
            const nuevoNombre = prompt("Ingresa el Nombre Completo del nuevo usuario:");
            if (nuevoNombre) {
                alert(`🚀 Redireccionando al formulario de registro técnico para matricular a: "${nuevoNombre}" en el sistema.`);
            }
        });
    }


    // ==========================================================
    // 6. INICIALIZACIÓN AUTOMÁTICA
    // ==========================================================
    // Ejecutamos el conteo de datos por primera vez al abrir la pantalla
    calcularEstadisticas();

    // Activamos los escuchas de los filtros
    if (buscador) buscador.addEventListener('input', filtrarUsuarios);
    if (selectRol) selectRol.addEventListener('change', filtrarUsuarios);
    if (selectColegio) selectColegio.addEventListener('change', filtrarUsuarios);
});