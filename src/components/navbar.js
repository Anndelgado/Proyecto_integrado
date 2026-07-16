import logo from "../assets/logo-transparent.png";

export function Navbar() {
  const el = document.createElement("header");
  el.className =
    "sticky top-0 z-50 border-b border-navy-900/5 bg-paper/90 backdrop-blur-md";

  el.innerHTML = `
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
      <a href="/" data-link class="flex items-center gap-2">
        <img src="${logo}" alt="Barranquilla Convive" class="h-15 w-60" />
      </a>

<div class="hidden items-center gap-8 md:flex">
  <a data-section="#" class="nav-link cursor-pointer relative text-sm font-medium text-navy-700 transition-all duration-300 hover:text-yellow-500 after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-0 after:rounded-full after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">
    Inicio
  </a>
  <a data-section="como-funciona" class="nav-link cursor-pointer relative text-sm font-medium text-navy-700 transition-all duration-300 hover:text-yellow-500 after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-0 after:rounded-full after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">
    ¿Cómo funciona?
  </a>

  <a data-section="impacto" class="nav-link cursor-pointer relative text-sm font-medium text-navy-700 transition-all duration-300 hover:text-yellow-500 after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-0 after:rounded-full after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">
    Impacto
  </a>

  <a data-section="contacto" class="nav-link cursor-pointer relative text-sm font-medium text-navy-700 transition-all duration-300 hover:text-yellow-500 after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-0 after:rounded-full after:bg-yellow-500 after:transition-all after:duration-300 hover:after:w-full">
    Contacto
  </a>
</div>

      <div class="flex items-center gap-3">
        <a
          href="/login"
          data-link
          class="rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-sm shadow-yellow-800/20 transition hover:bg-yellow-600"
        >
          Iniciar sesión
        </a>
      </div>
    </nav>
  `;

  // DOM listo
  setTimeout(() => {
  const links = el.querySelectorAll(".nav-link");

  // Scroll al hacer clic
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const id = link.dataset.section;
      const section = document.getElementById(id);

      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // Marca la sección activa
  const sections = [...links]
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          const active = link.dataset.section === entry.target.id;

          link.classList.toggle("text-yellow-500", active);
          link.classList.toggle("after:w-full", active);
        });
      });
    },
    {
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}, 0);

  return el;
}
