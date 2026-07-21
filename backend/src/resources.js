export const resources = {

    roles: {
        table: "roles",
        columns: ["id", "nombre"]
    },

    instituciones: {
        table: "instituciones",
        columns: ["id", "codigo", "nombre", "direccion", "localidad", "telefono"]
    },

    cursos: {
        table: "cursos",
        columns: ["id", "nombre", "institucionId"]
    },

    users: {
        table: "users",
        columns: [
            "id", "nombre", "apellido", "documento", "correo", "telefono",
            "password", "rol", "institucionId", "cursoId", "estado", "fechaRegistro"
        ]
    },

    alertas: {
        table: "alertas",
        columns: [
            "id", "estudianteId", "institucionId", "cursoId",
            "nivelRiesgo", "descripcion", "estado", "fecha"
        ]
    },

    seguimientos: {
        table: "seguimientos",
        columns: ["id", "alertaId", "usuarioId", "comentario", "fecha"]
    },

    notificaciones: {
        table: "notificaciones",
        columns: ["id", "usuarioId", "titulo", "mensaje", "leida", "fecha"]
    },

    tamizajeHabilitaciones: {
        table: "tamizajeHabilitaciones",
        columns: ["id", "estudianteId", "testId", "testNombre", "psicologoId", "fecha", "estado"]
    },

    tamizajeResultados: {
        table: "tamizajeResultados",
        columns: [
            "id", "habilitacionId", "estudianteId", "testId", "testNombre",
            "area", "icon", "color", "puntaje", "puntajeMax", "clasificacion",
            "nivel", "variant", "recomendacion", "criticos", "fecha"
        ],
        jsonColumns: ["criticos"]
    },

    citas: {
        table: "citas",
        columns: ["id", "psicologoId", "titulo", "fecha", "hora", "tipo", "estudianteId", "estudiante"]
    },

    testResultados: {
        table: "testResultados",
        columns: [
            "id", "estudianteId", "testId", "testNombre", "icon", "color",
            "fecha", "puntaje", "puntajeMax", "porcentaje", "nivel", "variant"
        ]
    },

    testAsignaciones: {
        table: "testAsignaciones",
        columns: ["id", "docenteId", "test", "estudiante", "fecha"]
    }

};
