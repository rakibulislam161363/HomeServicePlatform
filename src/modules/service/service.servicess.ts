import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./service.interface";

const createService = async (
  technicianId: string,
  payload: IServicePayload
) => {

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const result = await prisma.service.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      location: payload.location,
      categoryId: payload.categoryId,
      technicianId,
    },
    include: {
      category: true,
      technician: true,
    },
  });

  return result;
};

const getAllServices = async () => {
  const result = await prisma.service.findMany({
    include: {
      category: true,
      technician: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateService = async (
  serviceId: string,
  payload: Partial<IServicePayload>
) => {
  const result = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: payload,
  });

  return result;
};

const deleteService = async (serviceId: string) => {
  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });

  return null;
};

export const serviceService = {
    createService,
    getAllServices,
    updateService,
    deleteService
}