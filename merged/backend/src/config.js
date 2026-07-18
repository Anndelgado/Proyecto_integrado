// ======================================================
// config.js
// Barranquilla Convive - Backend
// ======================================================
// Este archivo SOLO carga las variables de entorno desde backend/.env.
// Debe ser el PRIMER import en server.js (antes de pool.js o
// cualquier otro módulo que lea process.env al cargarse), porque en
// ES modules todos los "import" se ejecutan antes que el resto del
// código del archivo que los declara. Si dotenv.config() se llamara
// como código normal después de los imports, módulos como pool.js ya
// habrían leído (mal) las variables de entorno para ese momento.
// ======================================================

import dotenv from "dotenv";

dotenv.config({ override: true });
