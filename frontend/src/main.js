import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Debe importarse antes que cualquier vista/servicio, para que todas
// las llamadas a fetch("/api/...") salgan ya con el token adjunto.
import "./httpAuth.js";

import { startRouter } from "./router.js";
import "./routes.js";

startRouter();
