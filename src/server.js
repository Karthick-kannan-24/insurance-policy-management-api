import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";
import { startCpuMonitor } from "./utils/cpuMonitor.js";
import { startMessageScheduler } from "./services/message.scheduler.js";

const startServer = async () => {
  try {
    await connectDatabase();

     startMessageScheduler();

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);

      // Start CPU monitoring
      startCpuMonitor();
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
};

startServer();