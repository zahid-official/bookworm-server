import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import multerUpload from "../../config/multer";
import BookController from "./book.controller";
import { createBookZodSchema, updateBookZodSchema } from "./book.validation";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(...Object.values(Role)),
  BookController.getAllBooks
);
router.get(
  "/:id",
  validateToken(...Object.values(Role)),
  BookController.getSingleBook
);

// Post routes
router.post(
  "/create",
  multerUpload.single("file"),
  validateToken(Role.ADMIN),
  validateSchema(createBookZodSchema),
  BookController.createBook
);

// Patch routes
router.patch(
  "/:id",
  multerUpload.single("file"),
  validateToken(Role.ADMIN),
  validateSchema(updateBookZodSchema),
  BookController.updateBook
);

// Delete routes
router.delete("/:id", validateToken(Role.ADMIN), BookController.deleteBook);

// Export book routes
const BookRoutes = router;
export default BookRoutes;
