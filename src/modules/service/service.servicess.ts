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

const getAllServices = async (query: any) => {
  const {
    search,
    categoryId,
    location,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where: any = {};

  // Search
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Category Filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Location Filter
  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  // Price Filter
  if (minPrice || maxPrice) {
    where.price = {};

    if (minPrice) {
      where.price.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const services = await prisma.service.findMany({
    where,
    include: {
      category: true,
      technician: {
        omit: {
          password: true,
        },
      },
    },
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.service.count({
    where,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: services,
  };
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