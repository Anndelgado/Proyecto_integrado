import logo from "../assets/logo-transparent.png";

export function AuthLayout({ eyebrow, formHTML }) {
  const el = document.createElement("div");

  el.className =
    "min-h-screen flex items-center justify-center bg-[#f8f6f1] px-4 py-10";

  el.innerHTML = `
    <div class="w-full max-w-md">

      <!-- Tarjeta -->
<div class="rounded-3xl bg-white p-8 shadow-xl shadow-black/10">

    <a
        href="/"
        data-link
        class="mb-8 flex justify-center"
    >
        <img
            src="${logo}"
            alt="Barranquilla Convive"
            class="h-20 w-auto"
        >
    </a>

    ${formHTML}

</div>

    </div>
  `;

  return el;
}

export function fieldLabel(text) {
  return `
<label
class="mb-2 block text-sm font-medium text-navy-800">

${text}

</label>
`;
}

export function textInput({
  id,
  type = "text",
  placeholder,
  autocomplete = "",
}) {
  return `
<input
id="${id}"
name="${id}"
type="${type}"
placeholder="${placeholder}"
autocomplete="${autocomplete}"

class="
w-full
rounded-xl
border
border-gray-300
bg-white
px-4
py-3
text-navy-900
placeholder:text-gray-400
outline-none
transition
focus:border-yellow-400
focus:ring-4
focus:ring-yellow-200
"
/>
`;
}