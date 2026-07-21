import { apiFetch } from "../http.js";
const RESULTADOS_URL = "/api/testResultados";

const CATALOGO_TESTS = [

    {
        id: "ansiedad",
        nombre: "Test de Ansiedad",
        descripcion: "Evalúa tus niveles de ansiedad en el día a día.",
        icon: "brain",
        color: "blue",
        invertido: false, 
        preguntas: [
            "Me siento nervioso/a o inquieto/a con frecuencia.",
            "Me cuesta relajarme, incluso en mi tiempo libre.",
            "Me preocupo demasiado por diferentes situaciones.",
            "Siento tensión muscular o me siento agotado/a sin razón aparente.",
            "Tengo dificultad para concentrarme por estar preocupado/a."
        ]
    },

    {
        id: "estres",
        nombre: "Test de Estrés",
        descripcion: "Mide tu nivel de estrés académico y personal.",
        icon: "bolt",
        color: "yellow",
        invertido: false,
        preguntas: [
            "Siento que tengo más responsabilidades de las que puedo manejar.",
            "Me cuesta dormir por pensar en mis pendientes.",
            "Me siento irritable o de mal humor con facilidad.",
            "Siento que el tiempo no me alcanza para todo lo que debo hacer.",
            "Experimento dolores de cabeza o malestar físico con frecuencia."
        ]
    },

    {
        id: "autoestima",
        nombre: "Test de Autoestima",
        descripcion: "Descubre cómo te sientes contigo mismo/a.",
        icon: "star",
        color: "green",
        invertido: true, 
        preguntas: [
            "En general, estoy satisfecho/a conmigo mismo/a.",
            "Siento que tengo cualidades buenas.",
            "Soy capaz de hacer las cosas tan bien como la mayoría de las personas.",
            "Tengo una actitud positiva hacia mí mismo/a.",
            "Me siento una persona valiosa, al menos en igual medida que los demás."
        ]
    }

];

const OPCIONES = [
    { texto: "Nunca", valor: 0 },
    { texto: "A veces", valor: 1 },
    { texto: "Frecuentemente", valor: 2 },
    { texto: "Siempre", valor: 3 }
];
export function getCatalogoTests() {
    return CATALOGO_TESTS;
}

export function getOpciones() {
    return OPCIONES;
}
export async function getResultados(estudianteId) {

    const response = await apiFetch(
        `${RESULTADOS_URL}?estudianteId=${encodeURIComponent(estudianteId)}&_sort=fecha&_order=desc`
    );

    if (!response.ok) {

        throw new Error("Error obteniendo tus resultados de test.");

    }

    return await response.json();

}

export async function haCompletadoHoy(estudianteId, testId) {

    const hoy = new Date().toISOString().slice(0, 10);

    const resultados = await getResultados(estudianteId);

    return resultados.some(
        r => r.testId === testId && r.fecha === hoy
    );

}

export async function guardarResultado({ estudianteId, test, respuestas }) {

    const puntajeMax = test.preguntas.length * 3;

    const puntaje = respuestas.reduce((suma, valor) => suma + valor, 0);

    const porcentaje = Math.round((puntaje / puntajeMax) * 100);

    const nivel = calcularNivel(porcentaje, test.invertido);

    const payload = {

        estudianteId,

        testId: test.id,

        testNombre: test.nombre,

        icon: test.icon,

        color: test.color,

        fecha: new Date().toISOString().slice(0, 10),

        puntaje,

        puntajeMax,

        porcentaje,

        nivel: nivel.nombre,

        variant: nivel.variant

    };

    const response = await apiFetch(RESULTADOS_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(payload)

    });

    if (!response.ok) {

        throw new Error("No se pudo guardar el resultado del test.");

    }

    return await response.json();

}


function calcularNivel(porcentaje, invertido) {
    const escala = invertido
        ? [
            { limite: 40, nombre: "Bajo", variant: "danger" },
            { limite: 70, nombre: "Moderado", variant: "warning" },
            { limite: 101, nombre: "Alto", variant: "success" }
        ]
        : [
            { limite: 40, nombre: "Bajo", variant: "success" },
            { limite: 70, nombre: "Moderado", variant: "warning" },
            { limite: 101, nombre: "Alto", variant: "danger" }
        ];

    return escala.find(nivel => porcentaje < nivel.limite) ?? escala[escala.length - 1];

}
