document.addEventListener('DOMContentLoaded', () => {
    const formForgot = document.getElementById('forgot-form');
    const inputEmail = document.getElementById('forgot-email');
    const btnSubmit = document.getElementById('btn-forgot');

    // 1. BASE DE DATOS AUTOMÁTICA DE RESPALDO
    if (!localStorage.getItem('usuarios_sistema')) {
        const usuariosPrueba = [
            { email: 'admin@barranquilla.gov.co', pass: btoa('admin123'), rol: 'admin', ruta: '../view_admin/index.html' },
            { email: 'prueba@iedbarranquilla.edu.co', pass: btoa('estudiante123'), rol: 'estudiante', ruta: '../view_estudiante/index.html' }
        ];
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosPrueba));
    }

    if (formForgot) {
        formForgot.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailIngresado = inputEmail.value.trim().toLowerCase();

            // Animación del botón de carga
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `Procesando...`;
            }

            setTimeout(() => {
                // Traemos la lista de usuarios del almacenamiento local
                let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];

                // Buscamos la posición del correo ingresado
                const usuarioIndex = usuarios.findIndex(user => user.email === emailIngresado);

                if (usuarioIndex !== -1) {
                    // Generar Token aleatorio de seguridad de 9 caracteres
                    const tokenSimulado = Math.random().toString(36).substring(2, 11).toUpperCase();
                    
                    // Definir tiempo de expiración (Hora actual + 15 minutos)
                    const tiempoExpiracion = Date.now() + (15 * 60 * 1000);

                    // Guardamos el token y la expiración en la ficha de este usuario
                    usuarios[usuarioIndex].resetToken = tokenSimulado;
                    usuarios[usuarioIndex].resetTokenExpires = tiempoExpiracion;
                    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));

                    // REGLA CRÍTICA: Generamos la URL completa del servidor local para poder darle clic
                    const enlaceRecuperacion = `${window.location.origin}/src/views/aut/reset-password.html?token=${tokenSimulado}`;
                    
                    // Imprimimos el enlace de colores llamativos en la consola de desarrollador
                    console.log(`%c[SERVIDOR SIMULADO] Correo enviado a: ${emailIngresado}`, 'color: green; font-weight: bold;');
                    console.log(`%cEnlace de recuperación: ${enlaceRecuperacion}`, 'color: blue; text-decoration: underline; font-size: 12px;');

                    alert("📩 Si el correo institucional es válido, se ha enviado un enlace de recuperación.\n\n⚠️ NOTA PARA PRUEBAS: Abre la consola del navegador (F12) para hacer clic en el enlace azul.");
                    restaurarBoton(); // No redirigimos para evitar que Chrome limpie la consola
                } else {
                    // Misma respuesta por ciberseguridad
                    alert("📩 Si el correo institucional es válido, se ha enviado un enlace de recuperación.");
                    restaurarBoton();
                }
            }, 1000);
        });
    }

    function restaurarBoton() {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Enviar enlace";
        }
    }
});