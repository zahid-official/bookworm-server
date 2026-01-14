import { Router } from "express";
import AuthRoutes from "../modules/auth/auth.routes";
import UserRoutes from "../modules/user/user.routes";
import AdminRoutes from "../modules/admin/admin.routes";
import ReaderRoutes from "../modules/reader/reader.routes";
import GenreRoutes from "../modules/genre/genre.routes";
import BookRoutes from "../modules/book/book.routes";
import ReviewRoutes from "../modules/review/review.routes";
import TutorialRoutes from "../modules/tutorial/tutorial.routes";
import LibraryRoutes from "../modules/library/library.routes";

// Initialize main router
const router = Router();

// List of route configs
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/reader",
    route: ReaderRoutes,
  },
  {
    path: "/genre",
    route: GenreRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/tutorial",
    route: TutorialRoutes,
  },
  {
    path: "/library",
    route: LibraryRoutes,
  },
];

// Register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Export main router
const ModuleRouter = router;
export default ModuleRouter;
