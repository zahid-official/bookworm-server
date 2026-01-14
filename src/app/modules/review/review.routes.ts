import { Router } from "express";
import validateSchema from "../../middlewares/validateSchema";
import validateToken from "../../middlewares/validateToken";
import { Role } from "../user/user.interface";
import ReviewController from "./review.controller";
import { createReviewZodSchema } from "./review.validation";

// Initialize router
const router = Router();

// Get routes
router.get("/", validateToken(Role.ADMIN), ReviewController.getAllReviews);
router.get(
  "/book/:bookId",
  validateToken(...Object.values(Role)),
  ReviewController.getApprovedReviewsByBook
);
router.get("/:id", validateToken(Role.ADMIN), ReviewController.getSingleReview);

// Post routes
router.post(
  "/create",
  validateToken(Role.READER),
  validateSchema(createReviewZodSchema),
  ReviewController.createReview
);

// Patch routes
router.patch(
  "/approve/:id",
  validateToken(Role.ADMIN),
  ReviewController.approveReview
);

// Delete routes
router.delete("/:id", validateToken(Role.ADMIN), ReviewController.deleteReview);

// Export review routes
const ReviewRoutes = router;
export default ReviewRoutes;
