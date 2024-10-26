const express = require("express");
const path = require("path");
const app = express();
const pool = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");

app.use(express.json());

// Configuración para servir los archivos estáticos de React (en producción)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Importar rutas
const proyectoRoutes = require("./routes/proyectoRoutes");
const userRoutes = require("./routes/userRoutes");
const casoRoutes = require("./routes/casoRoutes");
const defectoRoutes = require("./routes/defectoRoutes");

// Usar rutas
app.use("/api/data/proyectos", proyectoRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/casos", casoRoutes);
app.use("/api/defectos", defectoRoutes);

// Configura Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware para manejar rutas no encontradas (404)
const notFoundHandler = require("./middleware/notFoundHandler");
app.use(notFoundHandler);

// Middleware de manejo de errores
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// Servir el frontend en todas las rutas no-API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
