// ======================================================
// routes.js
// Barranquilla Convive
// ======================================================
//
// Tabla central de rutas de la aplicación. Cada vista se registra una
// sola vez aquí, junto con las restricciones de acceso que le
// correspondan (pública, privada, o restringida a ciertos roles).
//
// ======================================================

import { registerRoute } from "./router.js";

//======================================================
// Vistas públicas
//======================================================

import { LandingPage } from "./views/landing.js";
import { LoginPage } from "./views/login.js";
import { RegisterPage } from "./views/register.js";
import { NotFoundPage } from "./views/not-found.js";

//======================================================
// Administrador
//======================================================

import { AdminDashboard } from "./views/admin/AdminDashboard.js";
import { UsersView } from "./views/admin/UsersView.js";
import { InstitucionesView } from "./views/admin/InstitucionesView.js";
import { AlertasView } from "./views/admin/AlertasView.js";
import { EstadisticasView } from "./views/admin/EstadisticasView.js";
import { ReportesView } from "./views/admin/ReportesView.js";
import { ConfiguracionView } from "./views/admin/ConfiguracionView.js";

//======================================================
// Docente
//======================================================

import { DocenteDashboard } from "./views/docente/DocenteDashboard.js";
import { EstudiantesView } from "./views/docente/EstudiantesView.js";
import { AlertasView as DocenteAlertasView } from "./views/docente/AlertasView.js";
import { TestView } from "./views/docente/TestView.js";
import { EstadisticasView as DocenteEstadisticasView } from "./views/docente/EstadisticasView.js";
import { RecursosView } from "./views/docente/RecursosView.js";
import { PerfilView as DocentePerfilView } from "./views/docente/PerfilView.js";

//======================================================
// Estudiante
//======================================================

import { EstudianteDashboard } from "./views/estudiante/EstudianteDashboard.js";

//======================================================
// Psicólogo / Orientador
//======================================================

import { PsicologoDashboard } from "./views/psicologo/PsicologoDashboard.js";
import { CaseDetailView } from "./views/psicologo/CaseDetailView.js";

//======================================================
// Públicas
//======================================================

registerRoute("/", LandingPage);
registerRoute("/404", NotFoundPage);

// Solo accesibles sin sesión activa: si el usuario ya inició sesión,
// el router lo redirige automáticamente a su panel.
registerRoute("/login", LoginPage, { guestOnly: true });
registerRoute("/register", RegisterPage, { guestOnly: true });

//======================================================
// Administrador
//======================================================

registerRoute("/admin", AdminDashboard, { roles: ["admin"] });
registerRoute("/admin/usuarios", UsersView, { roles: ["admin"] });
registerRoute("/admin/instituciones", InstitucionesView, { roles: ["admin"] });
registerRoute("/admin/alertas", AlertasView, { roles: ["admin"] });
registerRoute("/admin/estadisticas", EstadisticasView, { roles: ["admin"] });
registerRoute("/admin/reportes", ReportesView, { roles: ["admin"] });
registerRoute("/admin/configuracion", ConfiguracionView, { roles: ["admin"] });

//======================================================
// Docente
//======================================================

registerRoute("/docente", DocenteDashboard, { roles: ["docente"] });
registerRoute("/docente/estudiantes", EstudiantesView, { roles: ["docente"] });
registerRoute("/docente/alertas", DocenteAlertasView, { roles: ["docente"] });
registerRoute("/docente/test", TestView, { roles: ["docente"] });
registerRoute("/docente/estadisticas", DocenteEstadisticasView, { roles: ["docente"] });
registerRoute("/docente/recursos", RecursosView, { roles: ["docente"] });
registerRoute("/docente/perfil", DocentePerfilView, { roles: ["docente"] });

//======================================================
// Estudiante
//======================================================

registerRoute("/estudiante", EstudianteDashboard, { roles: ["estudiante"] });

//======================================================
// Psicólogo / Orientador
// (la base de datos usa el rol "orientador"; navigation.js lo
// normaliza a "psicologo" de forma transparente)
//======================================================

registerRoute("/psicologo", PsicologoDashboard, { roles: ["psicologo"] });
registerRoute("/psicologo/casos/:id", CaseDetailView, { roles: ["psicologo"] });
