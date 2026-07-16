document.addEventListener('DOMContentLoaded', () => {
    const formReset = document.getElementById('reset-form');
    const inputNewPassword = document.getElementById('new-password');
    const btnReset = document.getElementById('btn-reset');

    // 1. CAPTURAR EL TOKEN DE LA URL AUTOMÁTICAMENTE
    const parametrosURL = new URLSearchParams(window.location.search);
    const tokenURL = parametrosURL.get('token');

    // Bloqueo inmediato si entran de forma directa sin un token válido
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

            if (btnReset) {
                btnReset.disabled = true;
                btnReset.innerText = "Actualizando...";
            }

            // 2. LEER LA BASE DE DATOS COMPARTIDA
            let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];

            // 3. ENCONTRAR LA POSICIÓN EXACTA DEL USUARIO DUEÑO DEL TOKEN
            const usuarioIndex = usuarios.findIndex(user => user.resetToken === tokenURL);

            // Validar si el token existe
            if (usuarioIndex === -1) {
                alert("El enlace de recuperación es inválido o ya fue utilizado anteriormente.");
                window.location.href = './login.html';
                return;
            }

            // Validar si el token ya expiró (Límite: 15 minutos)
            if (Date.now() > usuarios[usuarioIndex].resetTokenExpires) {
                alert("⏰ El enlace de recuperación ha expirado. Por favor, solicite uno nuevo.");
                window.location.href = './forgot-password.html';
                return;
            }

            // Cambiamos la contraseña convirtiéndola a Base64
            usuarios[usuarioIndex].pass = btoa(nuevaPassword); 
            
            // Borramos las variables temporales de auditoría para cerrar el ciclo
            delete usuarios[usuarioIndex].resetToken;
            delete usuarios[usuarioIndex].resetTokenExpires;

            localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));

            alert("¡Contraseña actualizada con éxito!\nYa puede iniciar sesión con sus nuevas credenciales.");
            
            // Redirigir de inmediato al Login para usar la nueva clave
            window.location.href = './login.html';
        });
    }
});