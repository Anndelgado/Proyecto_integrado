document.addEventListener('DOMContentLoaded', () => {
    const formReset = document.getElementById('reset-form');
    const inputNewPassword = document.getElementById('new-password');

    // Capturar el token de la URL automáticamente
    const parametrosURL = new URLSearchParams(window.location.search);
    const tokenURL = parametrosURL.get('token');

    // Bloqueo inmediato si entran sin token en la URL
    if (!tokenURL) {
        alert("Acceso inválido. Falta el token de seguridad o el enlace está incompleto.");
        window.location.href = './login.html';
        return;
    }

    if (formReset) {
        formReset.addEventListener('submit', (e) => {
            e.preventDefault();

            const nuevaPassword = inputNewPassword.value.trim();

            if (nuevaPassword.length < 6) {
                alert("La nueva contraseña debe tener un mínimo de 6 caracteres.");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
            const usuarioEncontrado = usuarios.find(user => user.resetToken === tokenURL);

            // Validar si el token existe en el almacenamiento
            if (!usuarioEncontrado) {
                alert("El enlace de recuperación es inválido o ya fue utilizado anteriormente.");
                window.location.href = './login.html';
                return;
            }

            // Validar si el token ya expiró por tiempo
            if (Date.now() > usuarioEncontrado.resetTokenExpires) {
                alert("El enlace de recuperación ha expirado tras 15 minutos. Solicite uno nuevo.");
                window.location.href = './forgot-password.html';
                return;
            }

            // Actualizar la contraseña en formato Base64 y limpiar tokens usados
            usuarioEncontrado.pass = btoa(nuevaPassword);
            delete usuarioEncontrado.resetToken;
            delete usuarioEncontrado.resetTokenExpires;

            localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));

            // Alerta nativa de éxito total
            alert("¡Contraseña actualizada con éxito!\nYa puede iniciar sesión con sus nuevas credenciales.");
            window.location.href = './login.html';
        });
    }
});