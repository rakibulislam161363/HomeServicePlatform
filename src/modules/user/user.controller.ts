import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req:Request, res: Response, next: NextFunction) =>{

  const result = await userService.getAllUsers(req.query as any);

  sendResponse(res,{
    success:true,
    statusCode: httpStatus.OK,
    message:"user created successfully",
    data: result

  })
});

const getSingleUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await userService.getSingleUser(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  }
);


const updateUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await userService.getUserUpdate(
      payload,
      id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: result,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await userService.updateUserStatus(
      id as string,
      status
    );
    

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  }
);

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
const getUserStats = catchAsync(async(req,res)=>{


 const result = await userService.getUserStats();


 sendResponse(res,{
   statusCode:200,
   success:true,
   message:"Stats fetched successfully",
   data:result
 });


});



export const userController = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserStatus,
    getUserStats,
    deleteUser
}