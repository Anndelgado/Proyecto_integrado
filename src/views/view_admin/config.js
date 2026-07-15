document.addEventListener('DOMContentLoaded', () => {

    // Formularios y elementos del DOM
    const profileForm = document.getElementById('profileForm');
    const systemParamsForm = document.getElementById('systemParamsForm');
    const notifEmail = document.getElementById('notifEmail');
    const notifWeekly = document.getElementById('notifWeekly');

    // Elementos del Toast (Notificación)
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    // Menús e interfaz responsive
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdownMenu = document.getElementById('profileDropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // ==========================================
    // LÓGICA DE NOTIFICACIONES TOAST (FEEDBACK)
    // ==========================================
    function showToast(message, isSuccess = true) {
        toastMessage.innerText = message;
        
        // Cambiar el icono si es error o éxito
        const icon = toastNotification.querySelector('i');
        if (isSuccess) {
            icon.className = "fa-solid fa-circle-check";
            icon.style.color = "var(--green-color)";
        } else {
            icon.className = "fa-solid fa-circle-exclamation";
            icon.style.color = "var(--red-color)";
        }

        toastNotification.classList.add('show');

        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000);
    }

    // ==========================================
    // CAPTURA DE EVENTOS DE FORMULARIOS
    // ==========================================
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('adminName').value;
        const email = document.getElementById('adminEmail').value;
        
        // Simulación de guardado exitoso
        showToast(`Perfil de [${name}] actualizado correctamente.`);
    });

    systemParamsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const year = document.getElementById('activeYear').value;
        const risk = document.getElementById('riskThreshold').value;

        showToast(`Parámetros aplicados: Ciclo ${year} - Umbral al ${risk}%`);
    });

    // Guardado interactivo en tiempo real al cambiar Toggles
    notifEmail.addEventListener('change', () => {
        const state = notifEmail.checked ? "Activadas" : "Desactivadas";
        showToast(`Notificaciones inmediatas por Email: ${state}`);
    });

    notifWeekly.addEventListener('change', () => {
        const state = notifWeekly.checked ? "Activadas" : "Desactivadas";
        showToast(`Resúmenes semanales: ${state}`);
    });

    // ==========================================
    // INTERFAZ GENERAL (Perfil y Hamburguesa)
    // ==========================================
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
});