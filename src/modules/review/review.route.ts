import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  reviewController.createReview
);

router.get(
  "/",
  reviewController.getAllReviews
);

router.get(
  "/:id",
  reviewController.getSingleReview
);

router.patch(
  "/:id",
  auth(Role.CUSTOMER),
  reviewController.updateReview
);

router.delete(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  reviewController.deleteReview
);

export const reviewRoute = router;