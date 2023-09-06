import { Book } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: Book) => {
  const result = await prisma.book.create({
    data: payload,
    include: { category: true },
  });
  return result;
};

export const BookService = { insertIntoDB };
