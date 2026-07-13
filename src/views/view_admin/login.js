document.addEventListener('DOMContentLoaded', () => {

    // 1. CAPTURA DE COMPONENTES DEL DOM
    const formulario = document.getElementById('login-form');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const btnSubmit = document.getElementById('btn-submit');

    // 2. BASE DE DATOS MOCK (SIMULADA) PARA PRUEBAS EN FRONTEND
    // Aquí defines los correos de prueba para verificar cómo actúan los roles
    const usuariosSimulados = [
        { email: 'admin@barranquilla.gov.co', pass: 'admin123', rol: 'admin', ruta: '/src/views/view_admin/index.html' },
        { email: 'orientador@concepcion.edu.co', pass: 'psico123', rol: 'psicologo', ruta: '#' }, // Ruta pendiente por tus compañeros
        { email: 'docente@robledo.edu.co', pass: 'profe123', rol: 'docente', ruta: '#' }          // Ruta pendiente por tus compañeros
    ];

    // 3. EVENTO DE INICIO DE SESIÓN
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos que la página se recargue automáticamente

            const correoIngresado = inputEmail.value.trim().toLowerCase();
            const passwordIngresado = inputPassword.value;

            // Animación visual en el botón de ingresar
            const textoOriginal = btnSubmit.innerText;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Validando credenciales...`;

            setTimeout(() => {
                // Buscamos si el usuario existe en nuestra lista simulada
                const usuarioEncontrado = usuariosSimulados.find(user => 
                    user.email === correoIngresado && user.pass === passwordIngresado
                );

                if (usuarioEncontrado) {
                    // Guardamos temporalmente el rol y la sesión en el navegador (Simulación de Session/LocalStorage)
                    localStorage.setItem('userRole', usuarioEncontrado.rol);
                    localStorage.setItem('userEmail', usuarioEncontrado.email);
                    localStorage.setItem('isLoggedIn', 'true');

                    alert(`¡Bienvenido! Rol Detectado: [ ${usuarioEncontrado.rol.toUpperCase()} ]\nRedirigiendo al panel oficial...`);
                    
                    // Si es el rol 'admin', te mandará directo al index del panel que armamos
                    if (usuarioEncontrado.ruta !== '#') {
                        window.location.href = usuarioEncontrado.ruta;
                    } else {
                        alert(`El rol '${usuarioEncontrado.rol}' es válido, pero el frontend de esa vista aún está en desarrollo por el equipo.`);
                        btnSubmit.disabled = false;
                        btnSubmit.innerText = textoOriginal;
                    }
                } else {
                    // Si los datos no coinciden
                    alert("❌ Acceso denegado: El correo institucional o la contraseña son incorrectos.");
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = textoOriginal;
                }

            }, 1200); // 1.2 segundos de espera simulando la latencia de respuesta del servidor
        });
    }
});