// ============================================
// Configuración de navegación por roles
// Barranquilla Convive
// ============================================

export const NAVIGATION = {
  admin: {
    label: "Administrador",
    items: [
      {
        id: "inicio",
        label: "Inicio",
        icon: "house",
        path: "/admin",
      },
      {
        id: "usuarios",
        label: "Usuarios",
        icon: "users",
        path: "/admin/usuarios",
      },
      {
        id: "instituciones",
        label: "Instituciones",
        icon: "school",
        path: "/admin/instituciones",
      },
      {
        id: "alertas",
        label: "Alertas",
        icon: "triangle-exclamation",
        path: "/admin/alertas",
      },
      {
        id: "estadisticas",
        label: "Estadísticas",
        icon: "chart-line",
        path: "/admin/estadisticas",
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: "file-lines",
        path: "/admin/reportes",
      },
      {
        id: "configuracion",
        label: "Configuración",
        icon: "gear",
        path: "/admin/configuracion",
      },
    ],
  },

  docente: {
    label: "Docente",
    items: [
      {
        id: "inicio",
        label: "Inicio",
        icon: "house",
        path: "/docente",
      },
      {
        id: "estudiantes",
        label: "Mis estudiantes",
        icon: "user-graduate",
        path: "/docente/estudiantes",
      },
      {
        id: "alertas",
        label: "Alertas",
        icon: "triangle-exclamation",
        path: "/docente/alertas",
      },
      {
        id: "test",
        label: "Test",
        icon: "clipboard-check",
        path: "/docente/test",
      },
      {
        id: "estadisticas",
        label: "Estadísticas",
        icon: "chart-column",
        path: "/docente/estadisticas",
      },
      {
        id: "recursos",
        label: "Recursos",
        icon: "book-open",
        path: "/docente/recursos",
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: "circle-user",
        path: "/docente/perfil",
      },
    ],
  },

  psicologo: {
    label: "Psicólogo",
    items: [
      {
        id: "inicio",
        label: "Inicio",
        icon: "house",
        path: "/psicologo",
      },
      {
        id: "casos",
        label: "Casos",
        icon: "folder-open",
        path: "/psicologo/casos",
      },
      {
        id: "seguimiento",
        label: "Seguimiento",
        icon: "notes-medical",
        path: "/psicologo/seguimiento",
      },
      {
        id: "agenda",
        label: "Agenda",
        icon: "calendar-days",
        path: "/psicologo/agenda",
      },
      {
        id: "reportes",
        label: "Reportes",
        icon: "file-lines",
        path: "/psicologo/reportes",
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: "circle-user",
        path: "/psicologo/perfil",
      },
    ],
  },

  estudiante: {
    label: "Estudiante",
    items: [
      {
        id: "inicio",
        label: "Inicio",
        icon: "house",
        path: "/estudiante",
      },
      {
        id: "test",
        label: "Mis test",
        icon: "clipboard-list",
        path: "/estudiante/test",
      },
      {
        id: "resultados",
        label: "Resultados",
        icon: "chart-pie",
        path: "/estudiante/resultados",
      },
      {
        id: "recursos",
        label: "Recursos",
        icon: "book-open-reader",
        path: "/estudiante/recursos",
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: "circle-user",
        path: "/estudiante/perfil",
      },
      {
        id: "ayuda",
        label: "Ayuda",
        icon: "circle-question",
        path: "/estudiante/ayuda",
      },
    ],
  },
};

/**
 * Alias de roles.
 *
 * La base de datos usa "orientador" como nombre de rol, pero el resto
 * de la app (menús, rutas, vistas) trabaja con "psicologo". Este mapa
 * evita tener que elegir un solo nombre en todos lados.
 */
const ROLE_ALIASES = {
  orientador: "psicologo",
};

/**
 * Normaliza un rol a su identificador canónico usado por la navegación
 * y las rutas.
 */
export function normalizeRole(role = "estudiante") {
  return ROLE_ALIASES[role] ?? role;
}

/**
 * Obtiene la navegación según el rol.
 */
export function getNavigation(role = "estudiante") {
  return NAVIGATION[normalizeRole(role)] ?? NAVIGATION.estudiante;
}

/**
 * Ruta de inicio (home) que le corresponde a cada rol. Se usa para
 * redirigir tras el login y cuando el router bloquea el acceso a una
 * ruta que no corresponde al rol de la sesión activa.
 */
export function getHomePath(role) {
  const nav = getNavigation(role);
  return nav.items[0]?.path ?? "/login";
}