import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.routes";
import AdminRoutes from "../modules/admin/admin.routes";
import ReaderRoutes from "../modules/reader/reader.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/reader",
    route: ReaderRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const ModuleRouter = router;
export default ModuleRouter;
