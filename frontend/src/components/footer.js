import logo from "../assets/logo-transparent.png";

export function Footer() {
  const el = document.createElement("footer");

  el.id = "contacto";
  el.className =
    "border-t border-yellow-200 bg-yellow-200";

  el.innerHTML = `
    <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row lg:px-10">

      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img
          src="${logo}"
          alt="Barranquilla Convive"
          class="h-12 w-auto"
        />

      </div>

      <!-- Copyright -->

      <p class="text-center text-sm text-navy-900">
        © ${new Date().getFullYear()} Barranquilla Convive.
        Todos los derechos reservados.
      </p>

      <!-- Redes -->

      <div class="flex items-center gap-5 text-navy-900">

        <a href="#" class="transition hover:scale-110">
          <i class="fa-brands fa-facebook-f text-lg"></i>
        </a>

        <a href="#" class="transition hover:scale-110">
          <i class="fa-brands fa-x-twitter text-lg"></i>
        </a>

        <a href="#" class="transition hover:scale-110">
          <i class="fa-brands fa-instagram text-lg"></i>
        </a>

        <a href="#" class="transition hover:scale-110">
          <i class="fa-brands fa-youtube text-lg"></i>
        </a>

      </div>

    </div>
  `;

  return el;
}