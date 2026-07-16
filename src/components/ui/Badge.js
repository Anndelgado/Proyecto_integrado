// ======================================================
// Badge.js
// Barranquilla Convive
// ======================================================

/**
 * Badge reutilizable
 *
 * Variants:
 * success
 * warning
 * danger
 * info
 * neutral
 */

export function Badge({
  text = "",
  variant = "neutral",
} = {}) {

  const badge = document.createElement("span");

  const variants = {

    success: `
      bg-emerald-100
      text-emerald-700
    `,

    warning: `
      bg-yellow-100
      text-yellow-700
    `,

    danger: `
      bg-red-100
      text-red-700
    `,

    info: `
      bg-blue-100
      text-blue-700
    `,

    neutral: `
      bg-slate-100
      text-slate-700
    `

  };

  badge.className = `
    inline-flex
    items-center
    justify-center
    rounded-full
    px-3
    py-1
    text-xs
    font-semibold
    whitespace-nowrap
    ${variants[variant]}
  `;

  badge.textContent = text;

  return badge;

}