import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user?.id;

  const result = await reviewService.createReview(
    customerId as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviews();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await reviewService.getSingleReview(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = req.user?.id;

  const result = await reviewService.updateReview(
    id as string,
    customerId as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = req.user?.id;

  await reviewService.deleteReview(id as string, customerId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});
const getMyReviews = catchAsync(
  async (req: Request, res: Response) => {
    const technicianId = req.user?.id;

    const result =
      await reviewService.getMyReviews(
        technicianId as string
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message:
        "My reviews retrieved successfully",
      data: result,
    });
  }
);
const getMyReviewByBooking = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const { bookingId } = req.params;

    const result = await reviewService.getMyReviewByBooking(
      bookingId as string,
      customerId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review retrieved successfully",
      data: result,
    });
  }
);

export const reviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  getMyReviews,
  getMyReviewByBooking,
  updateReview,
  deleteReview,
};