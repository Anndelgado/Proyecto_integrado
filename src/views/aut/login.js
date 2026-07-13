document.addEventListener('DOMContentLoaded', () => {

    // 1. CAPTURA DE COMPONENTES DEL DOM
    const formulario = document.getElementById('login-form');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const btnSubmit = document.getElementById('btn-submit');

    // 2. BASE DE DATOS MOCK SIMULADA
    // Usamos el salto de carpeta "../" para salir de auth e ir a la vista del administrador
    const usuariosSimulados = [
        { email: 'admin@barranquilla.gov.co', pass: 'admin123', rol: 'admin', ruta: '../view_admin/index.html' },
        { email: 'orientador@concepcion.edu.co', pass: 'psico123', rol: 'psicologo', ruta: '#' }, 
        { email: 'docente@robledo.edu.co', pass: 'profe123', rol: 'docente', ruta: '#' }
    ];

    // 3. EVENTO DE INICIO DE SESIÓN
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const correoIngresado = inputEmail.value.trim().toLowerCase();
            const passwordIngresado = inputPassword.value;

            // Animación del botón
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Validando...`;
            }

            setTimeout(() => {
                const usuarioEncontrado = usuariosSimulados.find(user => 
                    user.email === correoIngresado && user.pass === passwordIngresado
                );

                if (usuarioEncontrado) {
                    // Guardamos la sesión localmente
                    localStorage.setItem('userRole', usuarioEncontrado.rol);
                    localStorage.setItem('userEmail', usuarioEncontrado.email);
                    localStorage.setItem('isLoggedIn', 'true');

                    alert(`¡Bienvenido! Rol: [ ${usuarioEncontrado.rol.toUpperCase()} ]\nRedirigiendo...`);
                    
                    if (usuarioEncontrado.ruta !== '#') {
                        // Dispara la redirección usando la ruta relativa corregida
                        window.location.href = usuarioEncontrado.ruta;
                    } else {
                        alert(`El rol '${usuarioEncontrado.rol}' es correcto, pero su panel está siendo desarrollado por tus compañeros.`);
                        restaurarBoton();
                    }
                } else {
                    alert("❌ Correo institucional o contraseña incorrectos.");
                    restaurarBoton();
                }
            }, 1000);
        });
    }

    function restaurarBoton() {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Ingresar";
        }
    }
});