import Jwt,{ SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import { jwtUtils } from "../../utils/jwt";
import { IUserPayload } from "./auth.interface"
import bcrypt from "bcrypt";

const createUserDB = async(payload: IUserPayload)=>{
    const { name, email, password, phone, role } = payload;

    const userExit = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(userExit){
        throw new Error("user alrady exist")
    }

    const hashPassword = await bcrypt.hash(password,10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            phone,
            role
        },
        omit: {
            password: true,
        }
    })
    return user;
}


const loginUserDB = async(payload: IUserPayload) =>{
    const {email, password} = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    });
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch){
        throw new Error("password not match")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
    }

     const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtSecret,
    config.jwtExpiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiration as SignOptions, 
  )


  return {
    accessToken,
    refreshToken
  }



};

const getUserById = async(authId : string)=>{
   const user = await prisma.user.findUniqueOrThrow({
    where: {
        id: authId
    },
    omit: {
        password: true
    }
   });
   return user;
};


const refreshToken = async (refreshToken: string) => {

  const verifiedToken = jwtUtils.verifyToken(refreshToken, config.jwtRefreshSecret);

  if (!verifiedToken.success) {
    throw new Error("Invalid refresh token");
  }

  const {id} = verifiedToken.data as Jwt.JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    }
  })

  if(user.status === "INACTIVE"){
    throw new Error("User is inactive");
  };

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtSecret,
    config.jwtExpiration as SignOptions,
  );

  return{ accessToken }
}


export const authService = {
    createUserDB,
    loginUserDB,
    getUserById,
    refreshToken
}