export const seedData = {
    "users": [
        {
            "id": 1,
            "nombre": "Administrador",
            "apellido": "Distrital",
            "documento": "1000000000",
            "correo": "admin@baq.com",
            "telefono": "3000000000",
            "password": "admin123",
            "rol": "admin",
            "institucionId": null,
            "cursoId": null,
            "estado": "activo",
            "fechaRegistro": "2026-07-11"
        },
        {
            "id": 2,
            "nombre": "Andrés",
            "apellido": "Duarte",
            "documento": "1122334455",
            "correo": "andres.duarte@baq.com",
            "telefono": "3012345678",
            "password": "estudiante123",
            "rol": "estudiante",
            "institucionId": 1,
            "cursoId": 1,
            "estado": "activo",
            "fechaRegistro": "2026-07-11"
        },
        {
            "id": 3,
            "nombre": "María",
            "apellido": "González",
            "documento": "1098765432",
            "correo": "maria.gonzalez@baq.com",
            "telefono": "3009876543",
            "password": "docente123",
            "rol": "docente",
            "institucionId": 1,
            "cursoId": null,
            "estado": "activo",
            "fechaRegistro": "2026-07-11"
        },
        {
            "id": 4,
            "nombre": "Laura",
            "apellido": "Ramírez",
            "documento": "1054789632",
            "correo": "laura.ramirez@baq.com",
            "telefono": "3021234567",
            "password": "psicologo123",
            "rol": "psicologo",
            "institucionId": 1,
            "cursoId": null,
            "estado": "activo",
            "fechaRegistro": "2026-07-11"
        },
        {
            "id": 5,
            "nombre": "Carlos",
            "apellido": "Pérez",
            "documento": "1001452365",
            "correo": "carlos.perez@baq.com",
            "telefono": "3001112233",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 1,
            "cursoId": 2,
            "estado": "activo",
            "fechaRegistro": "2026-07-10"
        },
        {
            "id": 6,
            "nombre": "Sofía",
            "apellido": "Martínez",
            "documento": "1001452366",
            "correo": "sofia.martinez@baq.com",
            "telefono": "3001112234",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 2,
            "cursoId": 3,
            "estado": "activo",
            "fechaRegistro": "2026-07-10"
        },
        {
            "id": 7,
            "nombre": "Juan",
            "apellido": "Morales",
            "documento": "1001452367",
            "correo": "juan.morales@baq.com",
            "telefono": "3001112235",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 3,
            "cursoId": 4,
            "estado": "activo",
            "fechaRegistro": "2026-07-09"
        },
        {
            "id": 8,
            "nombre": "Valentina",
            "apellido": "Torres",
            "documento": "1001452368",
            "correo": "valentina.torres@baq.com",
            "telefono": "3001112236",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 1,
            "cursoId": 1,
            "estado": "activo",
            "fechaRegistro": "2026-07-08"
        },
        {
            "id": 9,
            "nombre": "Daniel",
            "apellido": "Rojas",
            "documento": "1001452369",
            "correo": "daniel.rojas@baq.com",
            "telefono": "3001112237",
            "password": "123456",
            "rol": "docente",
            "institucionId": 2,
            "cursoId": null,
            "estado": "activo",
            "fechaRegistro": "2026-07-07"
        },
        {
            "id": 10,
            "nombre": "Paula",
            "apellido": "Herrera",
            "documento": "1001452370",
            "correo": "paula.herrera@baq.com",
            "telefono": "3001112238",
            "password": "123456",
            "rol": "psicologo",
            "institucionId": 3,
            "cursoId": null,
            "estado": "activo",
            "fechaRegistro": "2026-07-07"
        },
        {
            "id": 11,
            "nombre": "Miguel",
            "apellido": "Castro",
            "documento": "1001452371",
            "correo": "miguel.castro@baq.com",
            "telefono": "3001112239",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 2,
            "cursoId": 3,
            "estado": "inactivo",
            "fechaRegistro": "2026-07-06"
        },
        {
            "id": 12,
            "nombre": "Camila",
            "apellido": "Gómez",
            "documento": "1001452372",
            "correo": "camila.gomez@baq.com",
            "telefono": "3001112240",
            "password": "123456",
            "rol": "estudiante",
            "institucionId": 3,
            "cursoId": 4,
            "estado": "activo",
            "fechaRegistro": "2026-07-05"
        }
    ],
    "roles": [
        {
            "id": 1,
            "nombre": "admin"
        },
        {
            "id": 2,
            "nombre": "psicologo"
        },
        {
            "id": 3,
            "nombre": "docente"
        },
        {
            "id": 4,
            "nombre": "estudiante"
        }
    ],
    "instituciones": [
        {
            "id": 1,
            "codigo": "IED-4521",
            "nombre": "IED La Concepción",
            "direccion": "Cra. 43 #80-15",
            "localidad": "Riomar",
            "telefono": "3850000"
        },
        {
            "id": 2,
            "codigo": "IED-7845",
            "nombre": "IED Jorge Robledo",
            "direccion": "Calle 72 #12-20",
            "localidad": "Suroriente",
            "telefono": "3850010"
        },
        {
            "id": 3,
            "codigo": "IED-9548",
            "nombre": "IED San José",
            "direccion": "Carrera 38 #45-10",
            "localidad": "Norte-Centro Histórico",
            "telefono": "3850020"
        }
    ],
    "cursos": [
        {
            "id": 1,
            "nombre": "9°A",
            "institucionId": 1
        },
        {
            "id": 2,
            "nombre": "9°B",
            "institucionId": 1
        },
        {
            "id": 3,
            "nombre": "10°A",
            "institucionId": 2
        },
        {
            "id": 4,
            "nombre": "11°A",
            "institucionId": 3
        }
    ],
    "alertas": [
        {
            "id": 1256,
            "estudianteId": 2,
            "institucionId": 1,
            "cursoId": 1,
            "nivelRiesgo": "alto",
            "descripcion": "Cambios frecuentes en el comportamiento y aislamiento social.",
            "estado": "pendiente",
            "fecha": "2026-07-11"
        },
        {
            "id": 1257,
            "estudianteId": 5,
            "institucionId": 1,
            "cursoId": 2,
            "nivelRiesgo": "medio",
            "descripcion": "Disminución del rendimiento académico.",
            "estado": "en proceso",
            "fecha": "2026-07-13"
        },
        {
            "id": 1258,
            "estudianteId": 6,
            "institucionId": 2,
            "cursoId": 3,
            "nivelRiesgo": "bajo",
            "descripcion": "Falta de participación en clase.",
            "estado": "pendiente",
            "fecha": "2026-07-14"
        },
        {
            "id": 1259,
            "estudianteId": 7,
            "institucionId": 3,
            "cursoId": 4,
            "nivelRiesgo": "alto",
            "descripcion": "Ausencias reiteradas durante el último mes.",
            "estado": "resuelto",
            "fecha": "2026-07-15"
        },
        {
            "id": 1260,
            "estudianteId": 8,
            "institucionId": 1,
            "cursoId": 1,
            "nivelRiesgo": "medio",
            "descripcion": "Conflictos frecuentes con compañeros.",
            "estado": "pendiente",
            "fecha": "2026-07-15"
        },
        {
            "id": 1261,
            "estudianteId": 12,
            "institucionId": 3,
            "cursoId": 4,
            "nivelRiesgo": "alto",
            "descripcion": "Indicadores de ansiedad durante entrevistas.",
            "estado": "en proceso",
            "fecha": "2026-07-16"
        }
    ],
    "seguimientos": [
        {
            "id": 1,
            "alertaId": 1256,
            "usuarioId": 4,
            "comentario": "Se realizó entrevista inicial con el estudiante.",
            "fecha": "2026-07-12"
        },
        {
            "id": 2,
            "alertaId": 1257,
            "usuarioId": 4,
            "comentario": "Se habló con el director de grupo.",
            "fecha": "2026-07-14"
        },
        {
            "id": 3,
            "alertaId": 1257,
            "usuarioId": 4,
            "comentario": "Se notificó al acudiente.",
            "fecha": "2026-07-15"
        },
        {
            "id": 4,
            "alertaId": 1259,
            "usuarioId": 10,
            "comentario": "Caso cerrado satisfactoriamente.",
            "fecha": "2026-07-16"
        },
        {
            "id": 5,
            "alertaId": 1261,
            "usuarioId": 10,
            "comentario": "Primera valoración psicológica realizada.",
            "fecha": "2026-07-17"
        }
    ],
    "notificaciones": [
        {
            "id": 1,
            "usuarioId": 2,
            "titulo": "Nueva alerta registrada",
            "mensaje": "Se ha registrado una alerta asociada a tu caso y será atendida por el psicólogo.",
            "leida": true,
            "fecha": "2026-07-12"
        },
        {
            "id": 2,
            "usuarioId": 5,
            "titulo": "Seguimiento programado",
            "mensaje": "Tu psicólogo programó una entrevista.",
            "leida": false,
            "fecha": "2026-07-15"
        },
        {
            "id": 3,
            "usuarioId": 6,
            "titulo": "Tamizaje disponible",
            "mensaje": "Debes completar un nuevo tamizaje.",
            "leida": false,
            "fecha": "2026-07-15"
        },
        {
            "id": 4,
            "usuarioId": 7,
            "titulo": "Caso finalizado",
            "mensaje": "Tu proceso fue cerrado exitosamente.",
            "leida": true,
            "fecha": "2026-07-16"
        },
        {
            "id": 5,
            "usuarioId": 8,
            "titulo": "Nueva observación",
            "mensaje": "Se registró una observación académica.",
            "leida": false,
            "fecha": "2026-07-16"
        }
    ],
    "tamizajeHabilitaciones": [
        {
            "id": 1,
            "estudianteId": 2,
            "testId": "mood",
            "testNombre": "Escala de Estado de Ánimo Adolescente",
            "psicologoId": 4,
            "fecha": "2026-07-10",
            "estado": "inactiva"
        },
        {
            "id": 2,
            "estudianteId": 8,
            "testId": "psychosocial_risk",
            "testNombre": "Escala de Riesgo Psicosocial Escolar",
            "psicologoId": 4,
            "fecha": "2026-07-12",
            "estado": "inactiva"
        },
        {
            "id": 3,
            "estudianteId": 7,
            "testId": "self_efficacy",
            "testNombre": "Escala de Autoeficacia Emocional",
            "psicologoId": 10,
            "fecha": "2026-07-13",
            "estado": "inactiva"
        },
        {
            "id": 4,
            "estudianteId": 12,
            "testId": "family",
            "testNombre": "Escala de Funcionamiento Familiar",
            "psicologoId": 10,
            "fecha": "2026-07-16",
            "estado": "activa"
        }
    ],
    "tamizajeResultados": [
        {
            "id": 1,
            "habilitacionId": 1,
            "estudianteId": 2,
            "testId": "mood",
            "testNombre": "Escala de Estado de Ánimo Adolescente",
            "area": "Emocional",
            "icon": "cloud-rain",
            "color": "navy",
            "puntaje": 18,
            "puntajeMax": 60,
            "clasificacion": "Leve",
            "nivel": "Bajo",
            "variant": "success",
            "recomendacion": "Observación y taller de habilidades emocionales.",
            "criticos": [],
            "fecha": "2026-07-10"
        },
        {
            "id": 2,
            "habilitacionId": 2,
            "estudianteId": 8,
            "testId": "psychosocial_risk",
            "testNombre": "Escala de Riesgo Psicosocial Escolar",
            "area": "Conductual",
            "icon": "triangle-exclamation",
            "color": "red",
            "puntaje": 27,
            "puntajeMax": 45,
            "clasificacion": "Alto",
            "nivel": "Alto",
            "variant": "danger",
            "recomendacion": "Remisión prioritaria a psicología y notificación a rectoría/acudiente.",
            "criticos": [],
            "fecha": "2026-07-12"
        },
        {
            "id": 3,
            "habilitacionId": 3,
            "estudianteId": 7,
            "testId": "self_efficacy",
            "testNombre": "Escala de Autoeficacia Emocional",
            "area": "Cognitiva",
            "icon": "hand-holding-heart",
            "color": "green",
            "puntaje": 52,
            "puntajeMax": 75,
            "clasificacion": "Media",
            "nivel": "Bajo",
            "variant": "success",
            "recomendacion": "Taller grupal de regulación emocional.",
            "criticos": [],
            "fecha": "2026-07-13"
        }
    ],
    "citas": [
        {
            "id": 1,
            "psicologoId": 4,
            "titulo": "Entrevista inicial",
            "fecha": "2026-07-16",
            "hora": "09:00",
            "tipo": "Entrevista",
            "estudianteId": null,
            "estudiante": null
        },
        {
            "id": 2,
            "psicologoId": 4,
            "titulo": "Sesión de seguimiento",
            "fecha": "2026-07-16",
            "hora": "11:30",
            "tipo": "Seguimiento",
            "estudianteId": null,
            "estudiante": null
        },
        {
            "id": 3,
            "psicologoId": 4,
            "titulo": "Reunión con acudiente",
            "fecha": "2026-07-17",
            "hora": "14:00",
            "tipo": "Reunión",
            "estudianteId": null,
            "estudiante": null
        }
    ],
    "testResultados": [],
    "testAsignaciones": []
};
