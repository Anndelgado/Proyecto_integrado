// ======================================================
// Card.js
// Componente base para todo el Dashboard
// ======================================================

/**
 * Card reutilizable
 *
 * @param {Object} options
 * @param {String} options.title
 * @param {String} options.subtitle
 * @param {HTMLElement} options.content
 * @param {String} options.className
 */

export function Card({
  title = "",
  subtitle = "",
  content = null,
  className = "",
} = {}) {
  const card = document.createElement("section");

  card.className = `
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    transition-all
    duration-200
    hover:shadow-md
    ${className}
  `;

  // Header
  if (title || subtitle) {
    const header = document.createElement("div");

    header.className = `
      border-b
      border-slate-100
      px-6
      py-5
    `;

    header.innerHTML = `
      ${
        title
          ? `<h3 class="text-lg font-semibold text-navy-900">${title}</h3>`
          : ""
      }

      ${
        subtitle
          ? `<p class="mt-1 text-sm text-slate-500">${subtitle}</p>`
          : ""
      }
    `;

    card.appendChild(header);
  }

  // Body
  const body = document.createElement("div");

  body.className = "p-6";

  if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  card.appendChild(body);

  return card;
}