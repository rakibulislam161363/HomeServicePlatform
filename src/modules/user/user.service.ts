import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IUserPayload } from "./user.interface"


const getAllUsers = async (
  query: Record<string, string | undefined>
) => {
  const users = await prisma.user.findMany({
    where: {
      ...(query.role && { role: query.role as any }),
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const getSingleUser = async (userId: string) => {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });
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

const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};

const getUserStats = async()=>{


  const totalUsers = await prisma.user.count();



  const customers = await prisma.user.count({

    where:{
      role:"CUSTOMER"
    }

  });



  const technicians = await prisma.user.count({

    where:{
      role:"TECHNICIAN"
    }

  });



  const activeUsers = await prisma.user.count({

    where:{
      status:"ACTIVE"
    }

  });



  return {
    totalUsers,
    customers,
    technicians,
    activeUsers
  };


};


export const userService = {
    getAllUsers,
    getSingleUser,
    getUserUpdate,
    updateUserStatus,
    deleteUser,
    getUserStats
}