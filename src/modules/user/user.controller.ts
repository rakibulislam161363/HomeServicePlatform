import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req:Request, res: Response, next: NextFunction) =>{

  const result = await userService.getAllUsers();

  sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message:"user created successfully",
    data: result

  })
});

const getSingleUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const result = await userService.getSingleUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single users",
    data: result
  })
});


const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const userId = req.user?.id;

  const result = await userService.getUserUpdate(payload, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data update successfully",
    data: result
  })
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await userService.updateUserStatus(id as string, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    data: result,
  });
});
})

const deleteUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
const {id} = req.params;
const result = await userService.deleteUser(id as string)

sendResponse(res, {
  success: true, 
  statusCode: httpStatus.OK,
  message: "User delete successfully",
  data: null
})
})



export const userController = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserStatus,
    deleteUser
}