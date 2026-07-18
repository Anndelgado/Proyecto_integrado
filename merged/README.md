# Barranquilla Convive

Plataforma GovTech de la Alcaldía de Barranquilla para la gestión y
atención temprana de alertas de salud mental y convivencia escolar.

## Qué cambió en esta versión

1. **Arquitectura reorganizada**: ahora el proyecto tiene una
   estructura estándar de tres carpetas en la raíz:

   ```
   /backend    → API REST en Express (Node.js)
     /backend/src/db  → conexión, schema.sql y datos semilla (la "database" del backend)
   /frontend   → la app Vite que ya tenías (Vue-less, JS vanilla), sin tocar su lógica de negocio
   ```

2. **Se reemplazó `json-server` por PostgreSQL real.** Antes,
   `database/db.json` era leído/escrito por `json-server`, que solo
   funciona si hay un proceso Node corriendo con acceso de escritura al
   disco. En un despliegue estático (Netlify, por ejemplo — de ahí el
   `public/_redirects` que ya traía el proyecto) ese proceso no existe,
   así que **nada se guardaba de verdad**: ni las agendas/citas, ni
   alertas, ni usuarios nuevos. Ahora todo se persiste en una base de
   datos Postgres real, a través de una API propia en `/backend`.

3. **Se corrigió el problema de las agendas.** El módulo de Agenda
   (`frontend/src/views/psicologo/AgendaView.js` y
   `frontend/src/services/CitaService.js`) ya llamaba correctamente a
   crear/eliminar citas, el problema era 100% de persistencia (punto
   2). Con el nuevo backend, crear y eliminar citas queda guardado en
   la tabla `citas` de Postgres y sobrevive a reinicios.

4. **Todos los módulos fueron migrados**, no solo agendas: usuarios,
   roles, instituciones, cursos, alertas, seguimientos,
   notificaciones, habilitaciones y resultados de tamizaje,
   resultados y asignaciones de test. El frontend casi no cambió: sus
   servicios (`frontend/src/services/*.js`) ahora llaman a `/api/...`
   en vez de `http://localhost:3000/...`, y ese `/api` se enruta al
   backend nuevo.

## Cómo probarlo (todo con un solo comando)

### 1. Requisitos

- Node.js 18+
- Una instancia de PostgreSQL corriendo en tu máquina (nativo, sin Docker).

### 2. Instalar dependencias (una sola vez)

Desde la **raíz** del proyecto:

```bash
npm install
```

Esto instala las dependencias de `backend/` y `frontend/` a la vez
(son "workspaces" de npm).

### 3. Levantar todo

```bash
npm run dev
```

Con ese único comando:

- Se espera a que Postgres esté disponible en `localhost:5432` (tu
  instalación nativa, con usuario `postgres` y la base
  `barranquilla_convive` — ajusta `backend/.env` si tu contraseña es
  distinta, ver más abajo).
- Se arranca el **backend** (`http://localhost:4000`), que al iniciar
  crea automáticamente las tablas si no existen y siembra los datos de
  ejemplo (los mismos usuarios/casos que ya tenías en `db.json`) si la
  base está vacía. No hace falta correr ninguna migración a mano.
- Se arranca el **frontend** (`http://localhost:5173`), con Vite
  redirigiendo `/api/*` hacia el backend.

Abre **http://localhost:5173** para usar la app.

### Usuarios de prueba (los mismos de siempre)

| Rol | Documento | Contraseña |
|---|---|---|
| Admin | 1000000000 | admin123 |
| Estudiante | 1122334455 | estudiante123 |
| Docente | 1098765432 | docente123 |
| Orientador / Psicólogo | 1054789632 | orientador123 |

### Otros comandos útiles

```bash
npm run build      # build de producción del frontend
```

## Configuración de la base de datos

Copia `backend/.env.example` a `backend/.env` y ajusta la conexión:

```bash
cp backend/.env.example backend/.env
```

Por defecto usa:

```
DATABASE_URL=postgres://postgres:TU_CONTRASEÑA@localhost:5432/barranquilla_convive
```

Reemplaza `TU_CONTRASEÑA` por la contraseña real de tu instalación
nativa de PostgreSQL (la que definiste al instalarlo, no
necesariamente `postgres`).

Solo necesitas que la base `barranquilla_convive` exista (créala con
`createdb barranquilla_convive` o `CREATE DATABASE barranquilla_convive;`
en `psql`); las tablas las crea el backend automáticamente al arrancar.

## Estructura de la API

El backend expone un endpoint REST por cada colección, con el mismo
"contrato" que ya usaba el frontend (filtros por query string y
`_sort`/`_order`), pero ahora respaldado por Postgres:

```
GET    /api/<recurso>            lista (soporta ?campo=valor y ?_sort=campo&_order=asc|desc)
GET    /api/<recurso>/:id
POST   /api/<recurso>
PUT    /api/<recurso>/:id
PATCH  /api/<recurso>/:id
DELETE /api/<recurso>/:id
GET    /api/health                estado del servidor y de la conexión a la base de datos
```

Recursos disponibles: `users`, `roles`, `instituciones`, `cursos`,
`alertas`, `seguimientos`, `notificaciones`, `tamizajeHabilitaciones`,
`tamizajeResultados`, `citas`, `testResultados`, `testAsignaciones`.

## Notas y siguientes pasos recomendados

- Las contraseñas se guardan **en texto plano**, igual que en el
  proyecto original (con `json-server`). Funciona para pruebas, pero
  antes de un despliegue real conviene hashearlas (ej. con `bcrypt`) y
  mover el login (`AuthService.js`) a un endpoint propio del backend
  en lugar de comparar en el cliente.
- El backend no tiene autenticación/autorización todavía a nivel de
  API (cualquiera con acceso a `/api` puede leer o escribir); hoy el
  control de acceso vive solo en el router del frontend
  (`src/routes.js`). Para producción conviene añadir sesiones/JWT.
- Más detalles del frontend (router, despliegue) en `frontend/README.md`.
