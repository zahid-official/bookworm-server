import { Router } from "express";
import AuthController from "./auth.controller";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import validateSchema from "../../middlewares/validateSchema";
import { changePasswordZodSchema } from "./auth.validation";

// Initialize router
const router = Router();

// Post routes
router.post("/login", AuthController.credentialsLogin);
router.post("/logout", AuthController.logout);

// Patch routes
router.patch(
  "/changePassword",
  validateToken(...Object.values(Role)),
  validateSchema(changePasswordZodSchema),
  AuthController.changePassword
);

// Export auth routes
const AuthRoutes = router;
export default AuthRoutes;
