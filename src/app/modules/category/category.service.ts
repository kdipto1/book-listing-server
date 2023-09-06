import { Category } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getById = async (id: string) => {
  const result = prisma.category.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: { books: true },
  });
  return result;
};

export const CategoryService = { insertIntoDB, getAllFromDB, getById };
