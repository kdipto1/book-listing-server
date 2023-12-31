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

const updateById = async (id: string, payload: Category) => {
  const result = await prisma.category.update({
    where: { id },
    data: payload,
    select: { id: true, title: true },
  });
  return result;
};

const deleteById = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id: id },
    select: { id: true, title: true },
  });
  return result;
};

export const CategoryService = {
  insertIntoDB,
  getAllFromDB,
  getById,
  updateById,
  deleteById,
};
