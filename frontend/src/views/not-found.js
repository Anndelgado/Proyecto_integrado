export function NotFoundPage() {
  const el = document.createElement("div");
  el.className =
    "flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center";
  el.innerHTML = `
    <p class="font-display text-6xl font-extrabold text-navy-900/10">404</p>
    <h1 class="mt-4 font-display text-2xl font-bold text-navy-900">Página no encontrada</h1>
    <p class="mt-2 text-navy-500">La ruta que buscas no existe.</p>
    <a
      href="/"
      data-link
      class="mt-8 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-paper hover:bg-navy-800"
    >
      Volver al inicio
    </a>
  `;
  return el;
}
