import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createUser = catchAsync(async (req:Request, res: Response, next: NextFunction) =>{
  const payload = req.body;

  const result = await authService.createUserDB(payload);

  sendResponse(res,{
    success:true,
    statusCode: httpStatus.CREATED,
    message:"user created successfully",
    data: result

  })
});


const loginUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
 const payload = req.body;

 const {accessToken, refreshToken} = await authService.loginUserDB(payload);

  res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

 sendResponse(res, {
  success: true,
  statusCode: httpStatus.OK,
  message: "Login successfully",
  data: {accessToken, refreshToken}
 })
});

const getMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const authId = req.user?.id;

  const result = await authService.getUserById(authId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your profile",
    data: result
  })
});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token refreshed successfully",
        data: { accessToken }
    });

});



export const authController = {
    createUser,
    loginUser,
    getMyProfile,
    refreshToken
}