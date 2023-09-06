import { Category } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

export const CategoryService = { insertIntoDB };
