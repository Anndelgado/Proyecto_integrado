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
          class="hidden rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-sm shadow-yellow-800/20 transition hover:bg-yellow-600 sm:inline-block"
        >
          Iniciar sesión
        </a>

        <button
          type="button"
          id="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded="false"
          aria-controls="mobile-menu"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 transition hover:bg-navy-900/5 md:hidden"
        >
          <i class="fa-solid fa-bars text-xl" id="menu-icon-open"></i>
          <i class="fa-solid fa-xmark hidden text-xl" id="menu-icon-close"></i>
        </button>
      </div>
    </nav>

    <div
      id="mobile-menu"
      class="grid grid-rows-[0fr] overflow-hidden border-t border-navy-900/5 bg-paper transition-all duration-300 ease-in-out md:hidden"
    >
      <div class="min-h-0">
        <div class="flex flex-col gap-1 px-6 py-4">
          <a data-section="#" class="mobile-nav-link rounded-lg px-3 py-3 text-base font-medium text-navy-700 transition hover:bg-navy-900/5 hover:text-yellow-500">
            Inicio
          </a>
          <a data-section="como-funciona" class="mobile-nav-link rounded-lg px-3 py-3 text-base font-medium text-navy-700 transition hover:bg-navy-900/5 hover:text-yellow-500">
            ¿Cómo funciona?
          </a>
          <a data-section="impacto" class="mobile-nav-link rounded-lg px-3 py-3 text-base font-medium text-navy-700 transition hover:bg-navy-900/5 hover:text-yellow-500">
            Impacto
          </a>
          <a data-section="contacto" class="mobile-nav-link rounded-lg px-3 py-3 text-base font-medium text-navy-700 transition hover:bg-navy-900/5 hover:text-yellow-500">
            Contacto
          </a>
          <a
            href="/login"
            data-link
            class="mt-2 rounded-full bg-yellow-400 px-5 py-3 text-center text-sm font-semibold text-navy-900 shadow-sm shadow-yellow-800/20 transition hover:bg-yellow-600"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </div>
  `;


  setTimeout(() => {
  const links = el.querySelectorAll(".nav-link");
  const mobileLinks = el.querySelectorAll(".mobile-nav-link");
  const allSectionLinks = el.querySelectorAll("[data-section]");

  const menuToggle = el.querySelector("#menu-toggle");
  const mobileMenu = el.querySelector("#mobile-menu");
  const iconOpen = el.querySelector("#menu-icon-open");
  const iconClose = el.querySelector("#menu-icon-close");

  const closeMenu = () => {
    mobileMenu.classList.remove("grid-rows-[1fr]");
    mobileMenu.classList.add("grid-rows-[0fr]");
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  };

  const openMenu = () => {
    mobileMenu.classList.remove("grid-rows-[0fr]");
    mobileMenu.classList.add("grid-rows-[1fr]");
    iconOpen.classList.add("hidden");
    iconClose.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  
  allSectionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const id = link.dataset.section;
      const section = document.getElementById(id);

      closeMenu();

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

        mobileLinks.forEach((link) => {
          const active = link.dataset.section === entry.target.id;

          link.classList.toggle("text-yellow-500", active);
          link.classList.toggle("bg-navy-900/5", active);
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
