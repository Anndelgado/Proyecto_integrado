import { apiFetch } from "../http.js";
import { createAlerta } from "./AlertaService.js";
const HABILITACIONES_URL = "/api/tamizajeHabilitaciones";
const RESULTADOS_URL = "/api/tamizajeResultados";
const CATALOGO_TAMIZAJES = [
    {
        id: "family",
        nombre: "Escala de Funcionamiento Familiar",
        descripcion: "Evalúa cómo percibe el estudiante el apoyo, la comunicación y la resolución de problemas dentro de su familia.",
        area: "Emocional",
        icon: "people-roof",
        color: "blue",
        opciones: [
            { etiqueta: "Nunca", valor: 0 },
            { etiqueta: "Casi nunca", valor: 1 },
            { etiqueta: "Algunas veces", valor: 2 },
            { etiqueta: "Casi siempre", valor: 3 },
            { etiqueta: "Siempre", valor: 4 }
        ],
        preguntas: [
            { id: "fam_1", dominio: "Adaptación", texto: "Siento que en mi familia puedo contar con apoyo cuando algo me preocupa." },
            { id: "fam_2", dominio: "Comunicación", texto: "En mi casa hablamos abiertamente de los problemas que tenemos." },
            { id: "fam_3", dominio: "Apoyo emocional", texto: "Mi familia respeta y acepta mis decisiones y forma de ser." },
            { id: "fam_4", dominio: "Participación", texto: "Comparto tiempo y actividades con mi familia." },
            { id: "fam_5", dominio: "Resolución de problemas", texto: "Cuando surge un problema en casa, entre todos buscamos cómo resolverlo." }
        ],
        rangos: [
            { min: 18, max: 20, etiqueta: "Buena funcionalidad", recomendacion: "No requiere intervención. Reforzamiento positivo.", nivel: "Bajo" },
            { min: 14, max: 17, etiqueta: "Riesgo leve", recomendacion: "Seguimiento en próxima evaluación periódica.", nivel: "Bajo" },
            { min: 10, max: 13, etiqueta: "Riesgo moderado", recomendacion: "Entrevista con el estudiante y, de ser posible, con la familia.", nivel: "Medio" },
            { min: 0, max: 9, etiqueta: "Riesgo alto", recomendacion: "Remisión prioritaria a psicología / trabajo social.", nivel: "Alto" }
        ]
    },
    {
        id: "mood",
        nombre: "Escala de Estado de Ánimo Adolescente",
        descripcion: "Explora cómo se ha sentido el estudiante durante las últimas dos semanas en distintas áreas emocionales y conductuales.",
        area: "Emocional",
        icon: "cloud-rain",
        color: "navy",
        opciones: [
            { etiqueta: "Nunca", valor: 0 },
            { etiqueta: "Algunos días", valor: 1 },
            { etiqueta: "Más de la mitad de los días", valor: 2 },
            { etiqueta: "Casi todos los días", valor: 3 }
        ],
        preguntas: [
            { id: "mood_1", dominio: "Tristeza", texto: "Me he sentido triste o decaído/a sin una razón clara." },
            { id: "mood_2", dominio: "Tristeza", texto: "He sentido ganas de llorar con más facilidad de lo normal." },
            { id: "mood_3", dominio: "Interés", texto: "He perdido el interés en actividades que antes disfrutaba." },
            { id: "mood_4", dominio: "Interés", texto: "Siento que nada me entusiasma como antes." },
            { id: "mood_5", dominio: "Motivación", texto: "Me ha costado encontrar motivos para hacer mis tareas o actividades diarias." },
            { id: "mood_6", dominio: "Motivación", texto: "Siento que hago las cosas 'porque toca', sin ánimo real." },
            { id: "mood_7", dominio: "Energía", texto: "Me he sentido cansado/a o sin energía durante el día." },
            { id: "mood_8", dominio: "Energía", texto: "Me cuesta más esfuerzo del habitual hacer actividades físicas simples." },
            { id: "mood_9", dominio: "Sueño", texto: "He tenido dificultad para dormir o me despierto varias veces en la noche." },
            { id: "mood_10", dominio: "Sueño", texto: "Duermo mucho más o mucho menos de lo que acostumbro." },
            { id: "mood_11", dominio: "Apetito", texto: "He notado cambios en mi apetito (como mucho más o mucho menos de lo usual)." },
            { id: "mood_12", dominio: "Apetito", texto: "He perdido o subido de peso sin proponérmelo." },
            { id: "mood_13", dominio: "Concentración", texto: "Me cuesta concentrarme en clase o al hacer tareas." },
            { id: "mood_14", dominio: "Concentración", texto: "Se me olvidan las cosas con más frecuencia de lo normal." },
            { id: "mood_15", dominio: "Autoestima", texto: "He sentido que no valgo lo suficiente o que soy un problema para los demás." },
            { id: "mood_16", dominio: "Autoestima", texto: "Me he sentido inseguro/a sobre quién soy o lo que puedo lograr." },
            { id: "mood_17", dominio: "Esperanza", texto: "Siento que las cosas no van a mejorar para mí." },
            { id: "mood_18", dominio: "Esperanza", texto: "Me cuesta imaginar cosas buenas en mi futuro cercano." },
            { id: "mood_19", dominio: "Pensamientos negativos", texto: "Tengo pensamientos negativos repetitivos que no logro controlar." },
            { id: "mood_20", dominio: "Pensamientos negativos", texto: "He pensado que sería mejor no estar aquí o desaparecer.", critica: true }
        ],
        rangos: [
            { min: 0, max: 12, etiqueta: "Normal", recomendacion: "No requiere intervención específica.", nivel: "Bajo" },
            { min: 13, max: 24, etiqueta: "Leve", recomendacion: "Observación y taller de habilidades emocionales.", nivel: "Bajo" },
            { min: 25, max: 39, etiqueta: "Moderado", recomendacion: "Entrevista clínica con psicología en un plazo corto.", nivel: "Medio" },
            { min: 40, max: 60, etiqueta: "Alto", recomendacion: "Remisión prioritaria e informe inmediato al psicólogo.", nivel: "Alto" }
        ]
    },
    {
        id: "self_efficacy",
        nombre: "Escala de Autoeficacia Emocional",
        descripcion: "Mide qué tan capaz se percibe el estudiante para manejar sus emociones, resolver problemas y buscar apoyo cuando lo necesita.",
        area: "Cognitiva",
        icon: "hand-holding-heart",
        color: "green",
        opciones: [
            { etiqueta: "Nunca", valor: 1 },
            { etiqueta: "Casi nunca", valor: 2 },
            { etiqueta: "Algunas veces", valor: 3 },
            { etiqueta: "Casi siempre", valor: 4 },
            { etiqueta: "Siempre", valor: 5 }
        ],
        preguntas: [
            { id: "se_1", dominio: "Resolver problemas", texto: "Cuando tengo un problema, soy capaz de pensar en varias formas de resolverlo." },
            { id: "se_2", dominio: "Resolver problemas", texto: "Puedo tomar decisiones difíciles sin sentirme completamente bloqueado/a." },
            { id: "se_3", dominio: "Resolver problemas", texto: "Confío en que puedo enfrentar los retos que se me presentan." },
            { id: "se_4", dominio: "Buscar ayuda", texto: "Si necesito ayuda, sé a quién puedo acudir." },
            { id: "se_5", dominio: "Buscar ayuda", texto: "Me siento cómodo/a pidiendo apoyo cuando algo me supera." },
            { id: "se_6", dominio: "Buscar ayuda", texto: "Hablar de lo que me pasa con alguien de confianza me hace sentir mejor." },
            { id: "se_7", dominio: "Manejo emocional", texto: "Puedo calmarme cuando estoy muy molesto/a o alterado/a." },
            { id: "se_8", dominio: "Manejo emocional", texto: "Reconozco lo que estoy sintiendo aunque sea una emoción difícil." },
            { id: "se_9", dominio: "Manejo emocional", texto: "Soy capaz de expresar lo que siento sin hacerme daño ni dañar a otros." },
            { id: "se_10", dominio: "Control de pensamientos", texto: "Puedo dejar de darle vueltas a un pensamiento negativo cuando lo intento." },
            { id: "se_11", dominio: "Control de pensamientos", texto: "No dejo que un mal momento arruine todo mi día." },
            { id: "se_12", dominio: "Control de pensamientos", texto: "Puedo ver una situación difícil desde otro punto de vista." },
            { id: "se_13", dominio: "Afrontamiento", texto: "Me recupero relativamente rápido después de una decepción." },
            { id: "se_14", dominio: "Afrontamiento", texto: "Siento que aprendo de las dificultades que he vivido." },
            { id: "se_15", dominio: "Afrontamiento", texto: "Confío en mi capacidad de salir adelante ante los problemas." }
        ],
        rangos: [
            { min: 60, max: 75, etiqueta: "Alta", recomendacion: "Fortaleza a reforzar positivamente.", nivel: "Bajo" },
            { min: 45, max: 59, etiqueta: "Media", recomendacion: "Taller grupal de regulación emocional.", nivel: "Bajo" },
            { min: 30, max: 44, etiqueta: "Baja", recomendacion: "Acompañamiento individual sugerido.", nivel: "Medio" },
            { min: 15, max: 29, etiqueta: "Muy baja", recomendacion: "Entrevista con psicología en un plazo corto.", nivel: "Alto" }
        ]
    },
    {
        id: "psychosocial_risk",
        nombre: "Escala de Riesgo Psicosocial Escolar",
        descripcion: "Identifica situaciones de riesgo relacionadas con matoneo, violencia, consumo de sustancias, aislamiento y problemas familiares. Es la prueba más importante del sistema: cualquier respuesta afirmativa en preguntas críticas genera una alerta automática.",
        area: "Conductual",
        icon: "triangle-exclamation",
        color: "red",
        opciones: [
            { etiqueta: "Nunca", valor: 0 },
            { etiqueta: "Algunas veces", valor: 1 },
            { etiqueta: "Frecuentemente", valor: 2 },
            { etiqueta: "Siempre / Muy seguido", valor: 3 }
        ],
        preguntas: [
            { id: "risk_1", dominio: "Bullying", texto: "Otros compañeros me molestan, insultan o excluyen de forma repetida." },
            { id: "risk_2", dominio: "Bullying", texto: "He recibido burlas o mensajes ofensivos por redes sociales de compañeros del colegio." },
            { id: "risk_3", dominio: "Violencia", texto: "He sido testigo o víctima de peleas o agresiones físicas en el colegio o mi barrio." },
            { id: "risk_4", dominio: "Violencia", texto: "Me he sentido en peligro físico en algún lugar donde paso tiempo habitualmente." },
            { id: "risk_5", dominio: "Consumo de SPA", texto: "Personas cercanas a mí (amigos o familiares) consumen alcohol o drogas con frecuencia." },
            { id: "risk_6", dominio: "Consumo de SPA", texto: "He probado o consumido alcohol, cigarrillo u otra sustancia." },
            { id: "risk_7", dominio: "Riesgo suicida", texto: "He pensado en quitarme la vida.", critica: true },
            { id: "risk_8", dominio: "Riesgo suicida", texto: "He tenido un plan o intento de hacerme daño grave a mí mismo/a.", critica: true },
            { id: "risk_9", dominio: "Autolesiones", texto: "Me he lastimado a propósito (cortes, golpes u otra forma) para calmar lo que siento.", critica: true },
            { id: "risk_10", dominio: "Aislamiento", texto: "Prefiero estar solo/a la mayor parte del tiempo y evito a mis compañeros." },
            { id: "risk_11", dominio: "Aislamiento", texto: "Siento que no tengo con quién hablar en el colegio." },
            { id: "risk_12", dominio: "Problemas familiares", texto: "En mi casa hay peleas frecuentes, gritos o violencia entre los adultos." },
            { id: "risk_13", dominio: "Problemas familiares", texto: "Me preocupa la situación económica o de convivencia en mi hogar." },
            { id: "risk_14", dominio: "Abuso", texto: "Alguien me ha tocado o tratado de forma que me hizo sentir incómodo/a o asustado/a sin mi consentimiento.", critica: true },
            { id: "risk_15", dominio: "Abuso", texto: "He sido amenazado/a por un adulto o alguien con poder sobre mí.", critica: true }
        ],
        rangos: [
            { min: 0, max: 11, etiqueta: "Bajo", recomendacion: "No requiere remisión externa. Seguimiento en próxima evaluación.", nivel: "Bajo" },
            { min: 12, max: 22, etiqueta: "Moderado", recomendacion: "Entrevista con psicología en un plazo corto.", nivel: "Medio" },
            { min: 23, max: 33, etiqueta: "Alto", recomendacion: "Remisión prioritaria a psicología y notificación a rectoría/acudiente.", nivel: "Alto" },
            { min: 34, max: 45, etiqueta: "Crítico", recomendacion: "Atención inmediata. Activar protocolo de riesgo.", nivel: "Alto" }
        ]
    }

];

const NIVEL_VARIANT = {
    Bajo: "success",
    Medio: "warning",
    Alto: "danger"
};

export function getCatalogoTamizajes() {
    return CATALOGO_TAMIZAJES;
}

export function getTamizajePorId(id) {
    return CATALOGO_TAMIZAJES.find(test => test.id === id) ?? null;
}

export async function getHabilitaciones() {

    const response = await apiFetch(`${HABILITACIONES_URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo habilitaciones.");

    }

    return await response.json();

}

export async function getHabilitacionesEstudiante(estudianteId) {

    const response = await apiFetch(`${HABILITACIONES_URL}?estudianteId=${estudianteId}`);

    if (!response.ok) {

        throw new Error("Error obteniendo habilitaciones del estudiante.");

    }

    return await response.json();

}
export async function habilitarTamizaje({ estudianteId, testId, psicologoId }) {

    const test = getTamizajePorId(testId);

    if (!test) {

        throw new Error("Prueba no encontrada.");

    }

    const existentes = await getHabilitacionesEstudiante(estudianteId);

    const existente = existentes.find(h => h.testId === testId);

    if (existente) {

        return await actualizarHabilitacion(existente.id, {

            estado: "activa",

            psicologoId,

            fecha: new Date().toISOString().slice(0, 10)

        });

    }

    const response = await apiFetch(HABILITACIONES_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            estudianteId,

            testId,

            testNombre: test.nombre,

            psicologoId,

            fecha: new Date().toISOString().slice(0, 10),

            estado: "activa"

        })

    });

    if (!response.ok) {

        throw new Error("No se pudo habilitar la prueba.");

    }

    return await response.json();

}

async function actualizarHabilitacion(id, cambios) {

    const response = await apiFetch(`${HABILITACIONES_URL}/${id}`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(cambios)

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar la habilitación.");

    }

    return await response.json();

}

export async function revocarHabilitacion(id) {

    return await actualizarHabilitacion(id, { estado: "inactiva" });

}

export async function getResultadosEstudiante(estudianteId) {

    const response = await apiFetch(`${RESULTADOS_URL}?estudianteId=${estudianteId}&_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo resultados de tamizaje.");

    }

    return await response.json();

}

export async function getResultados() {

    const response = await apiFetch(`${RESULTADOS_URL}?_sort=fecha&_order=desc`);

    if (!response.ok) {

        throw new Error("Error obteniendo resultados de tamizaje.");

    }

    return await response.json();

}

/**
 * @param {Object} params
 * @param {Object} params.estudiante 
 * @param {Object} params.test 
 * @param {{questionId:string, value:number}[]} params.respuestas
 */
export async function guardarResultado({ estudiante, test, respuestas }) {

    const questionMap = new Map(test.preguntas.map(p => [p.id, p]));

    let puntaje = 0;

    const criticos = [];

    respuestas.forEach(respuesta => {

        const pregunta = questionMap.get(respuesta.questionId);

        if (!pregunta) return;

        puntaje += respuesta.value;

        if (pregunta.critica && respuesta.value > 0) {

            criticos.push({

                dominio: pregunta.dominio,

                texto: pregunta.texto

            });

        }

    });

    const puntajeMax = test.preguntas.length * Math.max(...test.opciones.map(o => o.valor));

    const clasificacion = test.rangos.find(r => puntaje >= r.min && puntaje <= r.max)
        ?? test.rangos[test.rangos.length - 1];

    const fecha = new Date().toISOString().slice(0, 10);

    const resultado = {

        estudianteId: estudiante.id,

        testId: test.id,

        testNombre: test.nombre,

        area: test.area,

        icon: test.icon,

        color: test.color,

        puntaje,

        puntajeMax,

        clasificacion: clasificacion.etiqueta,

        nivel: clasificacion.nivel,

        variant: NIVEL_VARIANT[clasificacion.nivel] ?? "neutral",

        recomendacion: clasificacion.recomendacion,

        criticos,

        fecha

    };

    const response = await apiFetch(RESULTADOS_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(resultado)

    });

    if (!response.ok) {

        throw new Error("No se pudo guardar el resultado del tamizaje.");

    }

    const guardado = await response.json();

    // La habilitación usada es de un solo uso: se desactiva al enviar.
    const habilitaciones = await getHabilitacionesEstudiante(estudiante.id);

    const habilitacionActiva = habilitaciones.find(
        h => h.testId === test.id && h.estado === "activa"
    );

    if (habilitacionActiva) {

        await revocarHabilitacion(habilitacionActiva.id);

    }
    const esCritico = criticos.length > 0;

    if (esCritico || clasificacion.nivel === "Alto") {

        await createAlerta({

            estudianteId: estudiante.id,

            institucionId: estudiante.institucionId,

            cursoId: estudiante.cursoId,

            nivelRiesgo: "alto",

            descripcion: esCritico

                ? `Tamizaje "${test.nombre}": respuesta afirmativa en ${criticos.length} pregunta(s) crítica(s) (${criticos.map(c => c.dominio).join(", ")}).`

                : `Tamizaje "${test.nombre}": clasificación de riesgo ${clasificacion.etiqueta}.`,

            estado: "pendiente",

            fecha

        }).catch(() => null);

    }

    return guardado;

}
