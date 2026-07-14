document.addEventListener('DOMContentLoaded', () => {
    const formForgot = document.getElementById('forgot-form'); // Asegúrate que tu HTML tenga este ID
    const inputEmail = document.getElementById('forgot-email');
    const btnSubmit = document.getElementById('btn-forgot');

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
                    const enlaceRecuperacion = `./reset-password.html?token=${tokenSimulado}`;
                    
                    // IMPRESIÓN CRÍTICA: Esto te servirá para hacer la demostración del proyecto
                    console.log(`%c[SERVIDOR SIMULADO] Correo enviado a: ${emailIngresado}`, 'color: green; font-weight: bold;');
                    console.log(`%cEnlace de recuperación: ${enlaceRecuperacion}`, 'color: blue; text-decoration: underline;');

                    alert("📩 Si el correo institucional es válido, se ha enviado un enlace de recuperación.\n\n⚠️ NOTA PARA PRUEBAS: Abre la consola del navegador (F12) para ver el enlace simulado.");
                    
                    // Redirigir al login después de avisar
                    window.location.href = './login.html';
                } else {
                    // Por seguridad de datos, mostramos el mismo mensaje aunque el correo no exista
                    alert("📩 Si el correo institucional es válido, se ha enviado un enlace de recuperación.");
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
