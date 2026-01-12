/* eslint-disable no-console */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import envVars from "./app/config/env";
import createDefaultAdmin from "./app/utils/createDefaultAdmin";

let server: Server;
const port = envVars.PORT || 5000;

// Initialize the application
const bootstrap = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVars.DB_URL);

    // Start the express server
    server = app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${envVars.PORT}`);
      console.log(`⚙️  Environment: ${envVars.NODE_ENV}`);
    });
  } catch (error) {
    console.error({
      success: false,
      message: "MongoDB connection failed",
      error,
    });
    process.exit(1);
  }
};

// Initialize the application
(async () => {
  await bootstrap();
  await createDefaultAdmin();
})();

// Graceful shutdown handlers
const handleExit = (signal: string, error?: unknown) => {
  const errorInfo = error ? { error } : {};

  console.error({
    message: `${signal} received. Server shutting down...`,
    ...errorInfo,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unhandled promise rejection
process.on("unhandledRejection", (error) => {
  handleExit("Unhandled Rejection", error);
});

// Uncaught exception
process.on("uncaughtException", (error) => {
  handleExit("Uncaught Exception", error);
});

// Process termination signals
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));
