import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import envVars from "./app/config/env";
import "./app/config/passport";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import ModuleRouter from "./app/routes";

// Express application
const app: Application = express();

// Middlewares
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [`${envVars.FRONTEND_URL}`, "http://localhost:3000"],
    credentials: true,
  })
);

// routes middleware
app.use("/api/v1", ModuleRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Bookworm Server");
});

// Handle global error
app.use(globalErrorHandler);

// Handle not found
app.use(notFoundHandler);

export default app;
