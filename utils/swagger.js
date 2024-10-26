// utils/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentación de la API para Next.js",
  },
  servers: [
    {
      url: `http://${HOST}:${PORT}`,
    },
  ],
};

const path = require("path");

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "../controllers/*.js")], // Utiliza la ruta absoluta para llegar a los controladores
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
