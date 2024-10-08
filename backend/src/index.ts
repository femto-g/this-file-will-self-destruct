import express, { Request, Response } from "express";
import { router as authRouter } from "./api/routes/auth";
import { router as fileRouter } from "./api/routes/file";
import passport from "passport";
import morgan from "morgan";
import { sessionMiddleware } from "./api/middleware/session";
import { corsMiddleware } from "./api/middleware/cors";
import { passportAsync } from "./api/middleware/auth";
import { logger } from "./core/logger";

export const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", true);
}

// app.use(morgan("tiny"));

morgan.token("body", (req) => {
  const anyReq = req as any;
  return JSON.stringify(anyReq.body);
});

app.use(morgan(":method :url :body"));
app.use(corsMiddleware);
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(passportAsync);
app.use((req, res, next) => {
  console.log(`Attached user: ${JSON.stringify(req.user)}`);
  next();
});

app.use("/", authRouter);
app.use("/", fileRouter);

app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error(err);
  return res.sendStatus(500);
});
