import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IUserPayload } from "./user.interface"


const getAllUsers = async ()=>{
   const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const getSingleUser = async (userId: string) => {
    const result = await prisma.user. findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })

    return result;
};


const getUserUpdate = async(payload: IUserPayload, userId: string) => {
    const { name, phone, status, role } = payload;

const result = await prisma.user.update({
  where: {
    id: userId,
  },
  data: {
    name,
    phone,
    status,
    role,
  },
  omit: {
    password: true,
  },
});

return result
    
};

const updateUserStatus = async (
  userId: string,
  status: UserStatus
) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const deleteUser = async(id : string)=> {
 const result = await prisma.user.delete({
    where: {
        id,
    }
 })
 return result
}


export const userService = {
    getAllUsers,
    getSingleUser,
    getUserUpdate,
    updateUserStatus,
    deleteUser
}