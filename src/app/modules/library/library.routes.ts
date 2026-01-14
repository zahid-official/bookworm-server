import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import LibraryController from "./library.controller";
import {
  createLibraryZodSchema,
  updateLibraryZodSchema,
} from "./library.validation";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(Role.READER),
  LibraryController.getMyLibrary
);

// Post routes
router.post(
  "/create",
  validateToken(Role.READER),
  validateSchema(createLibraryZodSchema),
  LibraryController.addBookToLibrary
);

// Patch routes
router.patch(
  "/:id",
  validateToken(Role.READER),
  validateSchema(updateLibraryZodSchema),
  LibraryController.updateLibrary
);

// Delete routes
router.delete("/:id", validateToken(Role.READER), LibraryController.deleteLibrary);

// Export library routes
const LibraryRoutes = router;
export default LibraryRoutes;
