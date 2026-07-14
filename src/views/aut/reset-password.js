document.addEventListener('DOMContentLoaded', () => {
    const formReset = document.getElementById('reset-form');
    const inputNewPassword = document.getElementById('new-password');
    const btnReset = document.getElementById('btn-reset');

    // 1. CAPTURAR EL TOKEN DE LA URL AUTOMÁTICAMENTE
    const parametrosURL = new URLSearchParams(window.location.search);
    const tokenURL = parametrosURL.get('token');

    // Si alguien entra a esta página sin un token en la URL, lo expulsamos al login
    if (!tokenURL) {
        alert("❌ Enlace inválido o sin token de acceso.");
        window.location.href = './login.html';
        return;
    }

    if (formReset) {
        formReset.addEventListener('submit', (e) => {
            e.preventDefault();

            const nuevaPassword = inputNewPassword.value;

            if (nuevaPassword.length < 6) {
                alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            // Traemos los usuarios del sistema
            let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];

            // 2. BUSCAR EL USUARIO QUE TENGA EL TOKEN DE LA URL
            const usuarioEncontrado = usuarios.find(user => user.resetToken === tokenURL);

            if (!usuarioEncontrado) {
                alert("❌ El enlace de recuperación es inválido o ya fue utilizado.");
                window.location.href = './login.html';
                return;
            }

            // 3. VERIFICAR QUE EL TOKEN NO HAYA EXPIRADO (Comparando tiempos)
            if (Date.now() > usuarioEncontrado.resetTokenExpires) {
                alert("⏰ El enlace de recuperación ha expirado (Límite: 15 minutos). Solicite uno nuevo.");
                window.location.href = './forgot-password.html';
                return;
            }

            // 4. ACTUALIZAR LA CONTRASEÑA Y LIMPIAR EL TOKEN (Para que no se vuelva a usar)
            usuarioEncontrado.pass = nuevaPassword; // Aquí se actualiza la clave común
            delete usuarioEncontrado.resetToken;        // Borramos el token usado
            delete usuarioEncontrado.resetTokenExpires; // Borramos la expiración

            // Guardamos los cambios actualizados en el localStorage
            localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));

            alert("🎉 ¡Contraseña actualizada con éxito!\nYa puede iniciar sesión con sus nuevas credenciales.");
            window.location.href = './login.html';
        });
    }
});
