import express from "express";
import healthRoutes from "./routes/health.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import messageRoutes from "./routes/message.routes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Insurance Assessment API",
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;