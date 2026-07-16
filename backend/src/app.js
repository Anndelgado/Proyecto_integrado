import express from "express";
import userRoutes from "./routes/users.routes.js";
import alertsRoutes from "./routes/alerts.routes.js"

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/alerts", alertsRoutes)

export default app; 