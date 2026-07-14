document.addEventListener('DOMContentLoaded', () => {

    // 1. CAPTURA DE COMPONENTES USANDO LOS NUEVOS IDS
    const formulario = document.getElementById('register-form');
    const inputNombre = document.getElementById('register-name');
    const inputCodigoColegio = document.getElementById('register-code');
    const inputEmail = document.getElementById('register-email');
    const btnSubmit = document.getElementById('btn-register');

    // 2. BASE DE DATOS DE CÓDIGOS ESCOLARES AUTORIZADOS
    const COLEGIOS_VALIDOS = ['IED-4521', 'IED-RIWI-2026', 'COL-PRUEBA'];

    // 3. EVENTO DE REGISTRO
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar lo que escribió el estudiante en la pantalla
            const nombreIngresado = inputNombre.value.trim();
            const codigoIngresado = inputCodigoColegio.value.trim().toUpperCase();
            const correoIngresado = inputEmail.value.trim().toLowerCase();

            // Validación manual de campos vacíos
            if (nombreIngresado === "" || codigoIngresado === "" || correoIngresado === "") {
                alert("⚠️ Todos los campos son obligatorios y no pueden contener solo espacios en blanco.");
                restaurarBoton();
                return; // Aquí sí va el return, detiene el proceso si están vacíos
            }

            // Animación del botón de carga (Se ejecuta si los campos están llenos)
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerText = "Validando institución...";
            }

            setTimeout(() => {
                // ========================================================
                // FILTRO 1: VALIDAR EL CÓDIGO DE LA INSTITUCIÓN
                // ========================================================
                if (!COLEGIOS_VALIDOS.includes(codigoIngresado)) {
                    alert("❌ Código de institución inválido. Esta escuela no está registrada en el programa de salud mental.");
                    restaurarBoton();
                    return;
                }

                // ========================================================
                // FILTRO 2: VALIDAR SI EL CORREO YA EXISTE EN LA BD
                // ========================================================
                let usuariosEnBD = JSON.parse(localStorage.getItem('usuarios_sistema')) || [];
                const elCorreoYaExiste = usuariosEnBD.some(user => user.email === correoIngresado);

                if (elCorreoYaExiste) {
                    alert("❌ Este correo ya está registrado. Intenta iniciar sesión.");
                    restaurarBoton();
                    return;
                }

                // ========================================================
                // PASO 3: CREAR CUENTA ASIGNANDO ROL Y CONTRASEÑA POR DEFECTO
                // ========================================================
                const passwordPorDefecto = btoa('estudiante123');

                const nuevoEstudiante = {
                    nombre: nombreIngresado,
                    email: correoIngresado,
                    pass: passwordPorDefecto,
                    rol: 'estudiante', 
                    ruta: '../view_estudiante/index.html', 
                    institucion: codigoIngresado
                };

                // Guardar en la base de datos simulada del localStorage
                usuariosEnBD.push(nuevoEstudiante);
                localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosEnBD));

                alert(`🎉 ¡Cuenta creada con éxito!\nBienvenido al programa de salud mental escolar.\n\n🔑 Tu contraseña provisional es: estudiante123\nPor seguridad, cámbiala al iniciar sesión.`);

                // Redirigir al login
                window.location.href = './login.html';

            }, 1200);
        });
    }

    function restaurarBoton() {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Crear cuenta";
        }
    }
});