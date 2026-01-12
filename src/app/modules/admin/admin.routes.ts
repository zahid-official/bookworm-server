import { Router } from "express";
import AdminController from "./admin.controller";
import validateSchema from "../../middlewares/validateSchema";
import createAdminSchema from "./admin.validation";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";

// Initialize router
const router = Router();

// Post routes
router.post(
  "/create",
  validateToken(Role.ADMIN),
  validateSchema(createAdminSchema),
  AdminController.createAdmin
);

// Export admin routes
const AdminRoutes = router;
export default AdminRoutes;
