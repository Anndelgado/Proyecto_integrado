-- ======================================================
-- schema.sql
-- Barranquilla Convive - Esquema de base de datos (Postgres)
-- ======================================================
-- Los nombres de columna se dejan en camelCase (entre comillas)
-- a propósito, para que coincidan exactamente con las claves que
-- ya usa el frontend (los servicios en src/services/*.js), y así
-- no haya que transformar los datos de ida y vuelta.
-- ======================================================

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS instituciones (
    id SERIAL PRIMARY KEY,
    codigo TEXT,
    nombre TEXT NOT NULL,
    direccion TEXT,
    localidad TEXT,
    telefono TEXT
);

CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    "institucionId" INTEGER REFERENCES instituciones(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT,
    documento TEXT UNIQUE,
    correo TEXT,
    telefono TEXT,
    password TEXT,
    rol TEXT NOT NULL DEFAULT 'estudiante',
    "institucionId" INTEGER REFERENCES instituciones(id) ON DELETE SET NULL,
    "cursoId" INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    "fechaRegistro" TEXT
);

CREATE TABLE IF NOT EXISTS alertas (
    id SERIAL PRIMARY KEY,
    "estudianteId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "institucionId" INTEGER REFERENCES instituciones(id) ON DELETE SET NULL,
    "cursoId" INTEGER REFERENCES cursos(id) ON DELETE SET NULL,
    "nivelRiesgo" TEXT,
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    fecha TEXT
);

CREATE TABLE IF NOT EXISTS seguimientos (
    id SERIAL PRIMARY KEY,
    "alertaId" INTEGER REFERENCES alertas(id) ON DELETE CASCADE,
    "usuarioId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
    comentario TEXT,
    fecha TEXT
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    "usuarioId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT,
    mensaje TEXT,
    leida BOOLEAN NOT NULL DEFAULT false,
    fecha TEXT
);

CREATE TABLE IF NOT EXISTS "tamizajeHabilitaciones" (
    id SERIAL PRIMARY KEY,
    "estudianteId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "testId" TEXT,
    "testNombre" TEXT,
    "psicologoId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
    fecha TEXT,
    estado TEXT NOT NULL DEFAULT 'activa'
);

CREATE TABLE IF NOT EXISTS "tamizajeResultados" (
    id SERIAL PRIMARY KEY,
    "habilitacionId" INTEGER,
    "estudianteId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "testId" TEXT,
    "testNombre" TEXT,
    area TEXT,
    icon TEXT,
    color TEXT,
    puntaje INTEGER,
    "puntajeMax" INTEGER,
    clasificacion TEXT,
    nivel TEXT,
    variant TEXT,
    recomendacion TEXT,
    criticos JSONB DEFAULT '[]',
    fecha TEXT
);

-- "Agendas": citas de psicología. Esta es la tabla que antes no se
-- guardaba (json-server no persiste en despliegues estáticos).
CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    "psicologoId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    tipo TEXT,
    "estudianteId" INTEGER REFERENCES users(id) ON DELETE SET NULL,
    estudiante TEXT
);

CREATE TABLE IF NOT EXISTS "testResultados" (
    id SERIAL PRIMARY KEY,
    "estudianteId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "testId" TEXT,
    "testNombre" TEXT,
    icon TEXT,
    color TEXT,
    fecha TEXT,
    puntaje INTEGER,
    "puntajeMax" INTEGER,
    porcentaje INTEGER,
    nivel TEXT,
    variant TEXT
);

CREATE TABLE IF NOT EXISTS "testAsignaciones" (
    id SERIAL PRIMARY KEY,
    "docenteId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    test TEXT,
    estudiante TEXT,
    fecha TEXT
);
