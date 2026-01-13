import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import multerUpload from "../../config/multer";
import BookController from "./book.controller";
import { createBookZodSchema } from "./book.validation";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  multerUpload.single("file"),
  validateToken(Role.ADMIN),
  validateSchema(createBookZodSchema),
  BookController.createBook
);

// Export book routes
const BookRoutes = router;
export default BookRoutes;
