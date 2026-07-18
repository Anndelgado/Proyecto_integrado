// ======================================================
// Avatar.js
// Barranquilla Convive
// ======================================================

/**
 * Avatar reutilizable
 */

export function Avatar({
  name = "Usuario",
  size = "md",
} = {}) {

  const avatar = document.createElement("div");

  const sizes = {

    sm: `
      h-9
      w-9
      text-xs
    `,

    md: `
      h-11
      w-11
      text-sm
    `,

    lg: `
      h-14
      w-14
      text-lg
    `,

    xl: `
      h-16
      w-16
      text-xl
    `

  };

  avatar.className = `
    flex
    items-center
    justify-center
    rounded-full
    bg-yellow-400
    font-bold
    text-navy-900
    select-none
    ${sizes[size]}
  `;

  avatar.textContent = name.charAt(0).toUpperCase();

  return avatar;

}