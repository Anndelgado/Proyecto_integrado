/**
 * GUARD.JS - Sistema de Control de Accesos y Roles para Dashboards
 * Este script valida la sesión activa y protege las vistas contra intrusos.
 */
(function () {
    // 1. VERIFICAR SI EXISTE UNA SESIÓN ACTIVA
    const sessionUser = JSON.parse(sessionStorage.getItem('session_user'));

    // Si no hay sesión, el usuario no se ha logueado. Lo expulsamos al login inmediatamente.
    if (!sessionUser || !sessionUser.rol) {
        alert("Acceso denegado. Debe iniciar sesión para acceder a esta sección.");
        // Ajusta la ruta relativa para regresar a la carpeta 'aut' desde los dashboards
        window.location.href = "../aut/login.html";
        return;
    }

    // 2. DETECTAR EN QUÉ DASHBOARD SE ENCUENTRA EL NAVEGADOR
    const urlActual = window.location.href.toLowerCase();
    const rolUsuario = sessionUser.rol.toLowerCase();

    // 3. REGLAS DE PROTECCIÓN POR ROLES
    // Filtro para el Panel de Administración
    if (urlActual.includes('view_admin') && rolUsuario !== 'admin') {
        bloquearAcceso("Administrador");
    }
    
    // Filtro para el Panel del Psicólogo (Resultados clínicos y test)
    else if (urlActual.includes('view_psicologo') && rolUsuario !== 'psicologo') {
        bloquearAcceso("Psicólogo Clínico");
    }
    
    // Filtro para el Panel de Docentes/Profesores
    else if (urlActual.includes('view_docente') && rolUsuario !== 'docente') {
        bloquearAcceso("Docente");
    }
    
    // Filtro para el Panel de Estudiantes (Responder test)
    else if (urlActual.includes('view_estudiante') && rolUsuario !== 'estudiante') {
        bloquearAcceso("Estudiante");
    }

    /**
     * Función interna para lanzar la alerta de bloqueo y redirigir al login
     */
    function bloquearAcceso(rolRequerido) {
        alert(`Acceso Restringido.\nEsta zona es exclusiva para el rol [ ${rolRequerido.toUpperCase()} ].\nSu rol actual es [ ${rolUsuario.toUpperCase()} ].`);
        
        // Lo devolvemos al login de forma segura
        window.location.href = "../aut/login.html";
        
        // Bloqueamos la carga del HTML deteniendo el flujo del navegador
        throw new Error("Acceso interrumpido por el Guardia de Seguridad de la plataforma.");
    }
})();