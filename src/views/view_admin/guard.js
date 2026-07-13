(function () {
    // 1. Validamos las llaves en el almacenamiento local del navegador
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    // 2. Si NO ha iniciado sesión o el rol NO es administrador, lo expulsamos inmediatamente
    if (isLoggedIn !== 'true' || userRole !== 'admin') {
        alert("🛑 Acceso denegado: Se requiere una sesión activa de Administrador.");
        
        // Al estar en la misma carpeta que index.html, subimos un nivel para ir a auth/login.html
        window.location.href = "../auth/login.html";
    }
})();