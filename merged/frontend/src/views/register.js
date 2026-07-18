import { AuthLayout, fieldLabel, textInput } from "../components/auth-layout.js";
import { navigate } from "../router.js";
import { findUserByEmail, findUserByDocumento, createUser } from "../api.js";
import { getInstitucionByCodigo } from "../services/InstitucionService.js";

export function RegisterPage() {
  const formHTML = `
    <div>

      <h2 class="font-display text-3xl font-bold text-navy-900">
        Crear cuenta de estudiante
      </h2>

      <p class="mt-2 text-navy-500">
        Docentes y directivos son registrados por la institución.
      </p>

    </div>

    <form
      id="register-form"
      class="mt-8 space-y-5"
      novalidate
    >

      <div>
        ${fieldLabel("Nombre completo")}
        ${textInput({
          id: "nombre",
          placeholder: "Nombre y apellido",
          autocomplete: "name",
        })}
      </div>

      <div>
        ${fieldLabel("Número de cédula")}
        ${textInput({
          id: "documento",
          type: "text",
          placeholder: "Ej. 1122334455",
          autocomplete: "off",
          inputmode: "numeric",
        })}
      </div>

      <div>
        ${fieldLabel("Código de institución")}
        ${textInput({
          id: "codigoInstitucion",
          placeholder: "Ej. IED-4521",
        })}
      </div>

      <div>
        ${fieldLabel("Correo institucional")}
        ${textInput({
          id: "correo",
          type: "email",
          placeholder: "nombre@iedbarranquilla.edu.co",
          autocomplete: "email",
        })}
      </div>

      <div>

        ${fieldLabel("Contraseña")}

        <div class="relative">

          ${textInput({
            id: "password",
            type: "password",
            placeholder: "Crea una contraseña",
            autocomplete: "new-password",
          })}

          <button
            type="button"
            id="toggle-password"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-yellow-500"
          >
            <i class="fa-regular fa-eye"></i>
          </button>

        </div>

      </div>

      <p
        id="register-error"
        class="hidden rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600"
      ></p>

      <p
        id="register-success"
        class="hidden rounded-xl bg-green-100 px-4 py-3 text-sm text-green-700"
      ></p>

      <button
        type="submit"
        id="register-submit"
        class="w-full rounded-xl bg-yellow-400 py-3.5 font-semibold text-navy-900 transition hover:bg-yellow-500"
      >
        Crear cuenta
      </button>

      <p class="text-center text-sm text-navy-500">
        El código de institución valida que perteneces a una institución registrada.
      </p>

    </form>

    <p class="mt-8 text-center text-sm text-navy-600">

      ¿Ya tienes cuenta?

      <a
        href="/login"
        data-link
        class="font-semibold text-yellow-600 hover:text-yellow-700"
      >
        Inicia sesión
      </a>

    </p>
  `;

  const el = AuthLayout({
    eyebrow: "Registro",
    formHTML,
  });

  queueMicrotask(() => wireRegisterForm(el));

  return el;
}

function wireRegisterForm(root) {
  const form = root.querySelector("#register-form");
  const errorEl = root.querySelector("#register-error");
  const successEl = root.querySelector("#register-success");
  const submitBtn = root.querySelector("#register-submit");

  const toggleBtn = root.querySelector("#toggle-password");
  const passwordInput = root.querySelector("#password");

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    toggleBtn.innerHTML = isPassword
      ? '<i class="fa-regular fa-eye-slash"></i>'
      : '<i class="fa-regular fa-eye"></i>';
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");

    const nombre = form.nombre.value.trim();
    const documento = form.documento.value.trim();
    const codigoInstitucion = form.codigoInstitucion.value.trim();
    const correo = form.correo.value.trim();
    const password = form.password.value;

    if (!nombre || !documento || !codigoInstitucion || !correo || !password) {
      return showError("Completa todos los campos.");
    }

    if (password.length < 6) {
      return showError(
        "La contraseña debe tener al menos 6 caracteres."
      );
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creando cuenta...";

    try {
      const existingDocumento = await findUserByDocumento(documento);

      if (existingDocumento) {
        return showError(
          "Ya existe una cuenta registrada con esa cédula."
        );
      }

      const existing = await findUserByEmail(correo);

      if (existing) {
        return showError(
          "Ya existe una cuenta registrada con ese correo."
        );
      }

      const institucion = await getInstitucionByCodigo(codigoInstitucion);

      if (!institucion) {
        return showError(
          "El código de institución no es válido. Verifica con tu colegio."
        );
      }

      await createUser({
        nombre,
        documento,
        institucionId: institucion.id,
        correo,
        password,
        rol: "estudiante",
        // "pendiente" es el estado que usa el resto del sistema (tabla de
        // usuarios y botón "Aprobar" del admin) para saber que la cuenta
        // necesita revisión antes de poder iniciar sesión.
        estado: "pendiente",
      });

      successEl.textContent =
        "Cuenta creada correctamente. Espera la aprobación de tu institución.";
      successEl.classList.remove("hidden");

      form.reset();

      setTimeout(() => {
        navigate("/login");
      }, 1800);

    } catch (err) {

      showError(
        "No pudimos conectar con el servidor. Verifica que el backend esté ejecutándose."
      );

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Crear cuenta";

    }

  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }
}