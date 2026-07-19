# Integración frontend (corregido) + backend (Postgres) — Barranquilla Convive

## Qué se hizo

Se combinaron tus dos entregas:
- **Frontend corregido** (vistas y componentes actualizados) → `frontend/`
- **Backend funcional con Postgres** (Express + `pg`, sin Docker) → `backend/`

El frontend corregido todavía apuntaba al viejo `json-server` (`http://localhost:3000`),
que no es el que vas a usar ahora. Se corrigieron estos archivos para que hablen con
el backend real (`http://localhost:4000`) a través de una ruta relativa `/api`:

- `frontend/src/api.js`
- `frontend/src/services/UserService.js`
- `frontend/src/services/AlertaService.js`
- `frontend/src/services/InstitucionService.js`
- `frontend/src/services/TamizajeService.js`
- `frontend/src/services/NotificationService.js`
- `frontend/src/services/CitaService.js`
- `frontend/src/services/SeguimientoService.js`
- `frontend/src/services/CursoService.js`

Además:
- Se agregó el **proxy `/api` → `http://localhost:4000`** en `frontend/vite.config.js`
  (así el navegador nunca llama directo a `localhost:4000`, evitando problemas de CORS/puertos).
- Se quitó `json-server`/`concurrently` del `package.json` del frontend (ya no aplica,
  ahora los datos viven en Postgres, servidos por `backend/`).
- Se eliminó `frontend/database/db.json` (base de datos falsa del `json-server` viejo);
  el backend siembra datos de prueba automáticamente en Postgres (`backend/src/db/seedData.js`)
  la primera vez que arranca.
- Se verificó que **todos los imports** del frontend resuelven correctamente y que
  **todos los archivos `.js`** (frontend y backend) son sintácticamente válidos (`node --check`).
- Se confirmó que las columnas/recursos que espera el frontend (`/api/users`, `/api/alertas`,
  `/api/instituciones`, `/api/cursos`, `/api/citas`, `/api/seguimientos`,
  `/api/notificaciones`, `/api/tamizajeHabilitaciones`, `/api/tamizajeResultados`,
  `/api/testResultados`, `/api/testAsignaciones`, `/api/roles`) coinciden exactamente
  con `backend/src/resources.js` y `backend/src/db/schema.sql`.

## ⚠️ Importante — no pude ejecutarlo en vivo aquí

Este entorno de trabajo no tiene:
- Acceso a internet (no puedo hacer `npm install`),
- PostgreSQL instalado,
- Los binarios nativos de Vite/Tailwind que trae tu `node_modules` están compilados
  para **Windows** (`win32-x64-msvc`), no para Linux.

Por eso **no pude levantar el proyecto y probarlo end-to-end desde acá**. Lo que sí hice:
validar sintaxis de todos los archivos, revisar que las rutas de importación existan,
y verificar manualmente que el contrato frontend↔backend (URLs, nombres de columnas,
formato de filtros `?campo=valor` y `_sort`/`_order`) sea consistente en ambos lados.

Vas a necesitar correrlo tú en tu máquina (Windows, según tu `.env`) para la prueba final.

## Cómo probarlo en tu máquina

1. **Postgres**: asegúrate de tener PostgreSQL 17 corriendo y de haber creado la base:
   ```sql
   CREATE DATABASE barranquilla_convive;
   ```
   Revisa que la contraseña en `backend/.env` (`DATABASE_URL`) coincida con la tuya.

2. **Instalar dependencias** (desde la raíz del proyecto, usa los workspaces):
   ```bash
   npm install
   ```

3. **Levantar todo junto** (backend + frontend):
   ```bash
   npm run dev
   ```
   Esto espera a que Postgres esté disponible, y luego levanta:
   - Backend en `http://localhost:4000` (crea las tablas y siembra datos de prueba si la BD está vacía)
   - Frontend en `http://localhost:5173`

4. **Probar login** con los usuarios de prueba sembrados (ver `backend/src/db/seedData.js`),
   por ejemplo:
   - Admin — documento `1000000000` / contraseña `admin123`
   - Estudiante — documento `1122334455` / contraseña `estudiante123`
   - Docente — documento `1098765432` / contraseña `docente123`
   - Orientador — documento `1054789632` / contraseña `orientador123`

5. Revisa `http://localhost:4000/api/health` — debe responder
   `{"status":"ok","database":"connected"}` si todo está bien conectado.

## Auditoría de funcionalidad (no solo conexión) — bugs reales encontrados y corregidos

Después de conectar frontend↔backend, revisé además que cada botón/flujo importante
realmente hiciera lo que dice hacer contra los datos y nombres reales del backend.
Encontré y corregí 3 problemas reales (no solo de URL):

1. **El registro de estudiantes dejaba a todos sin institución.**
   `views/register.js` mandaba el campo `codigoInstitucion` (ej. "IED-4521") al crear
   el usuario, pero la tabla `users` del backend no tiene esa columna — el router
   genérico la descartaba en silencio, así que `institucionId` quedaba `null` siempre.
   → Se agregó `getInstitucionByCodigo()` en `InstitucionService.js`, que busca la
   institución por su código antes de crear el usuario y envía el `institucionId`
   real. Si el código no existe, ahora se muestra un error claro al usuario.

2. **Los estudiantes registrados nunca aparecían para que el admin los aprobara.**
   `register.js` guardaba `estado: "pendiente_revision"`, pero **todo el resto del
   sistema** (`UsersView.js`, `UserTable.js`, filtros, contador de pendientes) busca
   exactamente `estado === "pendiente"`. → Corregido a `"pendiente"`.

3. **Una alerta de ejemplo quedaba con un estado "fantasma".**
   `backend/src/db/seedData.js` sembraba una alerta con `estado: "atendida"`, pero
   el frontend solo genera/reconoce `"pendiente"`, `"en seguimiento"` y `"resuelto"`
   (son los únicos 3 valores que sus botones escriben y que el badge de color sabe
   pintar). → Se cambió el dato sembrado a `"resuelto"` para que sea consistente
   con el resto de la app.

También limpié **6 mensajes/comentarios residuales** que aún mencionaban
"json-server" (en `login.js`, `register.js`, `api.js`, `AdminDashboard.js`,
`TamizajeService.js`, `TestService.js`) para que no confundan si algo falla.

Revisé además, sin encontrar problemas: los dos `controllers/` (usuarios e
instituciones), el mapeo de roles `orientador` ↔ `psicologo` (está bien resuelto
con un diccionario en `navigation.js`), los estados de habilitaciones de tamizaje
(`activa`/`inactiva`), el campo JSONB `criticos`, y los campos exactos que espera
`/api/citas`.

## Bug reportado y corregido: los test del estudiante no se guardaban en la BD

`TestService.js` (usado por `estudiante/TestView.js` y `estudiante/ResultadosView.js` —
los test de Ansiedad/Estrés/Autoestima) guardaba los resultados en un arreglo en
memoria del navegador. Al refrescar la página, se perdían.

**Corregido:** `TestService.js` ahora persiste contra `/api/testResultados`
(la tabla ya existía en el backend, solo no se estaba usando):
- `getResultados(estudianteId)` → `GET /api/testResultados?estudianteId=...`
- `guardarResultado(...)` → `POST /api/testResultados`
- Se quitó el arreglo en memoria y el contador de IDs falso.

Esto obligó a convertir `TestView.js` y `ResultadosView.js` a funciones `async`
(el router del proyecto ya soporta vistas asíncronas — así están construidas
`EstudianteDashboard.js` y otras vistas que sí usaban el backend), y a ajustar:
- El conteo de "Test completados" del encabezado.
- El badge "Respondido hoy" en el catálogo (ahora se calcula localmente contra
  los resultados ya cargados, sin llamadas de red extra por cada test).
- El historial reciente, que ahora se refresca con los datos reales del backend
  justo después de guardar un resultado nuevo.
- Manejo de error: si falla el guardado (ej. el backend está caído), se le
  avisa al usuario en vez de fallar en silencio.

El catálogo de preguntas (`getCatalogoTests`, `getOpciones`) sigue siendo estático
en el frontend — eso es correcto, no hay ni debería haber una tabla "tests" en la
base de datos para textos fijos de preguntas.

## Bug reportado y corregido: el perfil no mostraba toda la información (ej. documento vacío)

**Causa real (más grave de lo que parecía):** `login.js` guardaba en la sesión
**solo 4 campos** del usuario (`id`, `nombre`, `correo`, `rol`). Todo lo demás
(`documento`, `apellido`, `telefono`, `institucionId`, `cursoId`, `estado`,
`fechaRegistro`) se perdía apenas iniciabas sesión — por eso el input de
documento aparecía bloqueado pero vacío.

Esto no afectaba solo el perfil: **15 vistas** leen `session.institucionId`,
`session.cursoId`, `session.documento`, etc. (filtros de "mis estudiantes" del
docente, "mis casos" del psicólogo, agenda, estadísticas...). Todas estaban
recibiendo `undefined` en esos campos desde que se inicia sesión.

**Corregido:** `login.js` ahora guarda el usuario completo (menos la contraseña,
que nunca debe vivir en el navegador) en la sesión.

**Bug adicional que encontré al lado y también corregí:** el login no validaba
el campo `estado` del usuario. Un estudiante recién registrado (`estado:
"pendiente"`, sin aprobar por el admin) podía iniciar sesión igual, sin
esperar aprobación. Ahora el login rechaza cualquier cuenta cuyo `estado` no
sea `"activo"`, con un mensaje claro. Verifiqué que los 4 usuarios de prueba que
te di (admin/estudiante/docente/orientador) siguen con `estado: "activo"` en el
seed, así que ese login de prueba no se ve afectado.

## Limitación funcional que sigue pendiente (no era el bug reportado)

`docente/TestView.js` (donde el docente **asigna** tests a sus estudiantes) sigue
guardando esas asignaciones solo en la sesión del navegador — no persiste contra
`/api/testAsignaciones`, que sí existe en el backend con columnas listas
(`docenteId`, `test`, `estudiante`, `fecha`). Es un caso análogo al que acabas de
reportar, pero del lado del docente en vez del estudiante. Si quieres que lo
conecte igual, dímelo y lo hago con el mismo patrón que usé aquí.
