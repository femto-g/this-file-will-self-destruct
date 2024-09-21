import Router from "express-promise-router";
import { downloadUrlMiddleware, uploadUrlMiddleware } from "../middleware/file";
export const router = Router();

router.get("/upload-url", uploadUrlMiddleware);
router.get("/download-url", downloadUrlMiddleware);
