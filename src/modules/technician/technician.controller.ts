import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";

const getAllTechnicians = catchAsync(async (req, res) => {
  const result = await technicianService.getAllTechnicians(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians retrieved successfully",
    data: result,
  });
});

const getTechnicianById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await technicianService.getTechnicianById(
    id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician retrieved successfully",
    data: result,
  });
});


const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result =
    await technicianService.getMyProfile(userId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile retrieved successfully",
    data: result,
  });
});

const createMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result =
    await technicianService.createMyProfile(
      userId as string,
      req.body
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Technician profile created successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const result =
    await technicianService.updateMyProfile(
      userId as string,
      req.body
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: result,
  });
});

export const technicianController = {
  getAllTechnicians,
  getTechnicianById,
  getMyProfile,
  createMyProfile,
  updateMyProfile
};