import { AuthLayout, fieldLabel, textInput } from "../components/auth-layout.js";
import { navigate } from "../router.js";
import { findUserByEmail } from "../api.js";
import { setSession } from "../session.js";
import { getHomePath } from "../components/layout/navigation.js";

export function LoginPage() {
  const formHTML = `
    <div>

      <h2 class="font-display text-3xl font-bold text-navy-900">
        Bienvenido de nuevo
      </h2>

      <p class="mt-2 text-navy-500">
        Ingresa con tu cuenta institucional
      </p>

    </div>

    <form
      id="login-form"
      class="mt-8 space-y-5"
      novalidate
    >

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
            placeholder: "••••••••",
            autocomplete: "current-password",
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

      <div class="flex justify-end">

        <button
          type="button"
          id="forgot-password"
          class="text-sm font-medium text-navy-600 transition hover:text-yellow-500"
        >
          ¿Olvidaste tu contraseña?
        </button>

      </div>

      <p
        id="login-error"
        class="hidden rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600"
      ></p>

      <button
        type="submit"
        id="login-submit"
        class="w-full rounded-xl bg-yellow-400 py-3.5 font-semibold text-navy-900 transition hover:bg-yellow-500"
      >
        Ingresar
      </button>

      <p class="text-center text-sm text-navy-500">
        El sistema te redirige según tu rol:
        <strong>admin</strong>,
        <strong>docente</strong>,
        <strong>psicólogo</strong>
        o
        <strong>estudiante</strong>.
      </p>

    </form>

    <p class="mt-8 text-center text-sm text-navy-600">

      ¿No tienes cuenta?

      <a
        href="/register"
        data-link
        class="font-semibold text-yellow-600 hover:text-yellow-700"
      >
        Regístrate
      </a>

    </p>
  `;

  const el = AuthLayout({
    eyebrow: "Login",
    formHTML,
  });

  queueMicrotask(() => wireLoginForm(el));

  return el;
}

function wireLoginForm(root) {
  const form = root.querySelector("#login-form");
  const errorEl = root.querySelector("#login-error");
  const submitBtn = root.querySelector("#login-submit");

  const toggleBtn = root.querySelector("#toggle-password");
  const passwordInput = root.querySelector("#password");

  const forgotBtn = root.querySelector("#forgot-password");

  forgotBtn.addEventListener("click", () => {
    showError(
      "Escribe a tu institución para restablecer tu contraseña. Esta función llegará pronto."
    );
  });

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

    const correo = form.correo.value.trim();
    const password = form.password.value;

    if (!correo || !password) {
      return showError(
        "Completa tu correo institucional y contraseña."
      );
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Ingresando...";

    try {
      const user = await findUserByEmail(correo);

      if (!user || user.password !== password) {
        return showError(
          "Correo o contraseña incorrectos."
        );
      }

      setSession({

    id: user.id,

    nombre: user.nombre,

    correo: user.correo,

    rol: user.rol

});

      navigate(getHomePath(user.rol));

    } catch (err) {

      showError(
        "No pudimos conectar con el servidor. Verifica que json-server esté corriendo en el puerto 3000."
      );

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";

    }

  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove("hidden");
  }
}