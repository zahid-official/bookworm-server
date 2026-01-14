import { Router } from "express";
import validateToken from "../../middlewares/validateToken";
import UserController from "./user.controller";
import { Role } from "./user.interface";
import multerUpload from "../../config/multer";
import validateSchema from "../../middlewares/validateSchema";
import { updateProfileInfoZodSchema, updateRoleZodSchema } from "./user.validation";

// Initialize router
const router = Router();

// Get routes
router.get("/", validateToken(Role.ADMIN), UserController.getAllUsers);
router.get(
  "/singleUser/:id",
  validateToken(Role.ADMIN),
  UserController.getSingleUser
);
router.get(
  "/profile",
  validateToken(...Object.values(Role)),
  UserController.getProfileInfo
);

// Patch routes
router.patch(
  "/profile",
  multerUpload.single("file"),
  validateToken(...Object.values(Role)),
  validateSchema(updateProfileInfoZodSchema),
  UserController.updateProfileInfo
);
router.patch(
  "/updateRole/:id",
  validateToken(Role.ADMIN),
  validateSchema(updateRoleZodSchema),
  UserController.updateRole
);

// Delete routes
router.delete("/:id", validateToken(Role.ADMIN), UserController.deleteUser);

// Export user routes
const UserRoutes = router;
export default UserRoutes;
