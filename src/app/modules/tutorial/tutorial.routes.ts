import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import TutorialController from "./tutorial.controller";
import {
  createTutorialZodSchema,
  updateTutorialZodSchema,
} from "./tutorial.validation";

// Initialize router
const router = Router();

// Get routes
router.get(
  "/",
  validateToken(...Object.values(Role)),
  TutorialController.getAllTutorials
);
router.get(
  "/:id",
  validateToken(...Object.values(Role)),
  TutorialController.getSingleTutorial
);

// Post routes
router.post(
  "/create",
  validateToken(Role.ADMIN),
  validateSchema(createTutorialZodSchema),
  TutorialController.createTutorial
);

// Patch routes
router.patch(
  "/:id",
  validateToken(Role.ADMIN),
  validateSchema(updateTutorialZodSchema),
  TutorialController.updateTutorial
);

// Delete routes
router.delete("/:id", validateToken(Role.ADMIN), TutorialController.deleteTutorial);

// Export tutorial routes
const TutorialRoutes = router;
export default TutorialRoutes;
