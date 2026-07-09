import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { paymentService } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const result = await paymentService.createPayment(
    userId as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment session created successfully",
    data: result,
  });
});
const confirmPayment = catchAsync(async (req, res) => {
  const result = await paymentService.confirmPayment(req);

  res.status(200).json(result);
});

const getMyPayments = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result = await paymentService.getMyPayments(userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const result = await paymentService.getSinglePayment(
    id as string,
    userId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});


export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getSinglePayment
};