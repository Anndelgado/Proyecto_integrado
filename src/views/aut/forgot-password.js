document.addEventListener('DOMContentLoaded', () => {
    const formForgot = document.getElementById('forgot-form');
    const inputEmail = document.getElementById('forgot-email');
    const btnSubmit = document.getElementById('btn-forgot');


    if (!localStorage.getItem('usuarios_sistema')) {
        const usuarioPrueba = [{ email: 'prueba@iedbarranquilla.edu.co', pass: btoa('estudiante123'), rol: 'estudiante' }];
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarioPrueba));
    }


    if (formForgot) {
        formForgot.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailIngresado = inputEmail.value.trim().toLowerCase();

            // Animación de carga
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando...`;
            }

            setTimeout(() => {
                // Traemos los usuarios reales del sistema
                let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];

                // Buscamos si el usuario existe
                const usuarioIndex = usuarios.findIndex(user => user.email === emailIngresado);

                if (usuarioIndex !== -1) {
                    // 1. Generar Token único aleatorio de 9 caracteres
                    const tokenSimulado = Math.random().toString(36).substring(2, 11).toUpperCase();

                    // 2. Definir tiempo de expiración (Hora actual + 15 minutos)
                    const tiempoExpiracion = Date.now() + (15 * 60 * 1000);

                    // 3. Guardar estos campos temporales en el usuario dentro del localStorage
                    usuarios[usuarioIndex].resetToken = tokenSimulado;
                    usuarios[usuarioIndex].resetTokenExpires = tiempoExpiracion;
                    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));

                    // 4. Crear el enlace que se "enviaría" por correo
                    const enlaceRecuperacion = `${window.location.origin}/src/views/aut/reset-password.html?token=${tokenSimulado}`;

                    console.log(`[SERVIDOR SIMULADO] Correo enviado a: ${emailIngresado}`);
                    console.log(`Enlace de recuperación: ${enlaceRecuperacion}`);

                    alert("Si el correo institucional es válido, se ha enviado un enlace de recuperación.\n\n NOTA PARA PRUEBAS: Abre la consola del navegador (F12) para ver el enlace simulado.");
                    restaurarBoton();

                } else {
                    // Por seguridad de datos, mostramos el mismo mensaje aunque el correo no exista
                    alert("Si el correo institucional es válido, se ha enviado un enlace de recuperación.");
                    restaurarBoton();
                }
            }, 1500);
        });
    }

    function restaurarBoton() {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Enviar enlace";
        }
    }
});