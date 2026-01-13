import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import ReaderController from "./reader.controller";
import createReaderSchema from "./reader.validation";
import multerUpload from "../../config/multer";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  multerUpload.single("file"),
  validateSchema(createReaderSchema),
  ReaderController.createReader
);

// Export reader routes
const ReaderRoutes = router;
export default ReaderRoutes;
