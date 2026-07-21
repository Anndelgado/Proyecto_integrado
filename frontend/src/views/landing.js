import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";

export function LandingPage() {
  const el = document.createElement("div");
  el.className = "min-h-screen bg-paper";

  el.appendChild(Navbar());

  const main = document.createElement("main");
  main.innerHTML = `
    ${hero()}
    ${beneficios()}
    ${queEs()}
    ${impacto()}
    ${equipo()}
  `;
  el.appendChild(main);

  el.appendChild(Footer());
  return el;
}

function hero() {
  return `
<section  id="#" class="relative overflow-hidden bg-gradient-to-br  via-white 
">
  <div class="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:px-10">

    <div>

      <h1 class="font-display text-5xl font-extrabold leading-tight text-navy-900">
        Cuidamos la mente,
        <br>
        <span class="text-yellow-500">
          construimos futuro
        </span>
      </h1>

      <p class="mt-6 max-w-xl text-lg leading-relaxed text-navy-700">
        Plataforma de detección y atención temprana en salud mental y convivencia escolar para las instituciones educativas de Barranquilla.
      </p>

      <div class="mt-10 flex gap-4">

        <a href="#como-funciona" class="rounded-xl bg-navy-900 px-8 py-3 font-semibold text-white transition hover:bg-navy-800">
          Conocer más
        </a>

        <a href="/login" data-link class="rounded-xl bg-yellow-400 px-8 py-3 font-semibold text-navy-900 transition hover:bg-yellow-500">
          Iniciar sesión
        </a>
      </div>
    </div>

    <div class="relative flex justify-center">

      <img
        src="/src/assets/estudiantes.png"
        alt="Estudiantes"
        class="w-full max-w-xl"
      />
    </div>
  </div>
</section>
`;
}

function queEs(){

return`

<section
id="como-funciona"
class="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">

<div>

<p class="text-sm font-semibold uppercase tracking-widest text-yellow-500">

¿Qué es Barranquilla Convive?

</p>

<h2 class="mt-4 font-display text-4xl font-bold text-navy-900">

Una iniciativa para cuidar el bienestar de nuestros estudiantes.

</h2>

<p class="mt-6 leading-8 text-navy-600">

Barranquilla Convive es una plataforma desarrollada para fortalecer la convivencia escolar y promover la salud mental mediante la detección temprana, el seguimiento de casos y la generación de información que facilite la toma de decisiones.

</p>

<a
href="#como-funciona"
class="mt-10 inline-block rounded-xl bg-navy-900 px-8 py-3 font-semibold text-white transition hover:bg-navy-800">

Más sobre el proyecto

</a>

</div>

<div>

<img
src="/src/assets/barranquilla.jpeg"
class="w-full"
alt="Barranquilla"
/>

</div>

</section>
`;}


function beneficios() {

const cards = [
  {
    icon: '<i class="fa-solid fa-shield-halved text-4xl text-yellow-500"></i>',
    title: "Detección temprana",
    body: "Identificamos señales de alerta para actuar a tiempo.",
  },
  {
    icon: '<i class="fa-regular fa-comments text-4xl text-yellow-500"></i>',
    title: "Atención efectiva",
    body: "Activamos rutas y hacemos seguimiento a cada caso.",
  },
  {
    icon: '<i class="fa-solid fa-chart-column text-4xl text-yellow-500"></i>',
    title: "Datos que informan",
    body: "Estadísticas para tomar mejores decisiones.",
  },
  {
    icon: '<i class="fa-regular fa-heart text-4xl text-yellow-500"></i>',
    title: "Bienestar para todos",
    body: "Promovemos entornos escolares seguros y saludables.",
  },
];

return `
<section class="-mt-6 relative z-10">

<div class="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">

${cards.map(card=>`

<div class="rounded-2xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">

<div class="flex items-center justify-center text-5xl">
${card.icon}
</div>

<h3 class="mt-5 font-display text-lg font-bold text-navy-900">

${card.title}

</h3>

<p class="mt-3 text-sm leading-relaxed text-navy-600">

${card.body}

</p>

</div>

`).join("")}

</div>

</section>
`;

}

function impacto() {
  const stats = [
    {
      number: "120",
      title: "Instituciones\neducativas por vincular",
    },
    {
      number: "28.560",
      title: "Estudiantes\npor acompañar",
    },
    {
      number: "1.245",
      title: "Alertas\nque esperamos atender al año",
    },
    {
      number: "320",
      title: "Casos en\nseguimiento simultáneo",
    },
  ];

  return `
<section
id="impacto"
class="mx-auto max-w-7xl px-3 py-10 lg:px-8">

<div>

<h2
class="font-display text-4xl font-bold text-navy-900">

El impacto que buscamos generar

</h2>

<div
class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

${stats
  .map(
    (card) => `
<div
class="rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

<p
class="text-sm leading-6 whitespace-pre-line text-navy-500">

${card.title}

</p>

<p
class="mt-6 font-display text-5xl font-extrabold text-navy-900">

${card.number}

</p>

<p
class="mt-2 text-xs font-semibold uppercase tracking-wide text-yellow-600">

Meta

</p>

</div>
`
  )
  .join("")}

</div>

</div>

</section>
`;
}

function equipo() {

const people = [

{
img:"/src/assets/userpg.png",
name:"Kerlys Bello",
role:"Scrum Master"
},

{
img:"/src/assets/userpg.png",
name:"Kevin Villalobos",
role:"Desarrollador Backend"
},

{
img:"/src/assets/userpg.png",
name:"Yulianis Delgado",
role:"Product Owner"
},

{
img:"/src/assets/userpg.png",
name:"David Carrascal ",
role:"Desarrollador Front End"
},

{
img:"/src/assets/userpg.png",
name:"Santiago Otalora",
role:"Desarrollador Backend"
},

{
img:"/src/assets/userpg.png",
name:"Camilo Villalobos",
role:"Tester"
}

];

return`

<section id="contacto"
class="mx-auto max-w-7xl px-6 pb-24 lg:px-10">

<h2
class="font-display text-4xl font-bold text-navy-900">

Nuestro equipo

</h2>

<div
class="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">

${people.map(person=>`

<div
class="group text-center">

<div
class="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg transition duration-300 group-hover:scale-105">

<img
src="${person.img}"
class="h-full w-full object-cover">

</div>

<h3
class="mt-5 font-display text-lg font-bold text-navy-900">

${person.name}

</h3>

<p
class="text-sm text-navy-500">

${person.role}

</p>

</div>

`).join("")}

</div>

</section>

`;

}