import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string }) => {
  const isExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExists) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateCategory = async (
  categoryId: string,
  payload: { name: string }
) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: payload.name,
    },
  });

  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory
};