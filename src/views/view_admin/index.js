// 1. Esperamos a que el navegador termine de cargar todo el HTML
document.addEventListener('DOMContentLoaded', () => {
    // ===================================================
    // LÓGICA: MENÚ DESPLEGABLE DE PERFIL Y CERRAR SESIÓN
    // ===================================================
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    if (profileTrigger && profileDropdown) {
        // Al hacer clic en el perfil, abrimos/cerramos el dropdown
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitamos que el clic se propague al documento
            profileTrigger.classList.toggle('active');
            profileDropdown.classList.toggle('active');
        });

        // Al hacer clic en cualquier parte fuera del perfil, cerramos el menú
        document.addEventListener('click', () => {
            profileTrigger.classList.remove('active');
            profileDropdown.classList.remove('active');
        });

        // Evitar que el clic dentro del menú flotante lo cierre accidentalmente
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Acción para cerrar sesión
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            window.location.href = "/src/views/aut/login.html"; 
        }
        });


    // ==========================================
    // GRÁFICO 1: ALERTAS POR MES (LÍNEAS)
    // ==========================================

    // 2. Buscamos el primer lienzo en el HTML usando su ID "lineChart"
    const ctxLineas = document.getElementById('lineChart');

    // 3. Inicializamos un nuevo gráfico de tipo Chart
    new Chart(ctxLineas, {
        type: 'line', // Le decimos que el diseño sea una línea continua
        data: {
            // Las etiquetas que irán en el eje X (abajo)
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Cantidad de Alertas', // Título de la línea
                data: [65, 78, 120, 142, 98, 320], // Los números que dibujarán los puntos
                borderColor: '#f79c1d', // El color naranja característico de tu proyecto
                backgroundColor: 'rgba(247, 156, 29, 0.1)', // Fondo transparente bajo la línea
                tension: 0.3 // Hace que las curvas de la línea se vean suaves y modernas
            }]
        },
        options: {
            responsive: true, // Hace que el gráfico se adapte si achicas la pantalla
            plugins: {
                legend: { display: false } // Ocultamos el cuadro de leyenda para que se vea más limpio
            }
        }
    });


    // ==========================================
    // GRÁFICO 2: ALERTAS POR NIVEL (DONA)
    // ==========================================

    // 4. Buscamos el segundo lienzo en el HTML usando su ID "donutChart"
    const ctxDona = document.getElementById('donutChart');

    // 5. Inicializamos el gráfico circular tipo Dona
    new Chart(ctxDona, {
        type: 'doughnut', // Definimos el tipo "Dona"
        data: {
            // Las categorías que representan cada tajada
            labels: ['Bajo', 'Medio', 'Alto'],
            datasets: [{
                data: [150, 125, 45], // El total suma 320 (igual a tus tarjetas HTML)
                // Colores para cada sección (Verde para bajo, Amarillo/Naranja para medio, Rojo para alto)
                backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
                borderWidth: 2 // Grosor de la línea que separa cada tajada
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' // Colocamos los letreros guía abajo del círculo
                }
            }
        }
    });


    // ===================================================
    // NUEVA LÓGICA: MENÚ HAMBURGUESA / SIDECAR RESPONSIVO
    // ===================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Función para abrir la barra lateral
    if (hamburgerBtn && sidebar && sidebarOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }

    // Función para cerrar la barra lateral
    const closeMenu = () => {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    };

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeMenu);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMenu);
    }

});