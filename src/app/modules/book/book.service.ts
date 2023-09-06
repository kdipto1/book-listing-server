/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IBookFilterRequest } from './book.interfaces';

const insertIntoDB = async (payload: Book) => {
  const result = await prisma.book.create({
    data: payload,
    include: { category: true },
  });
  return result;
};

const getAllFromDB = async (
  filters: IBookFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const { search, minPrice, maxPrice, category, ...filtersData } = filters;

  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: ['title', 'author', 'genre'].map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (minPrice) {
    andConditions.push({
      AND: {
        price: {
          gte: minPrice,
        },
      },
    });
  }
  if (maxPrice) {
    andConditions.push({
      AND: {
        price: {
          lte: maxPrice,
        },
      },
    });
  }
  if (category) {
    andConditions.push({
      AND: {
        categoryId: category,
      },
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { category: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' },
  });

  const total = await prisma.book.count({ where: whereConditions });

  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      page,
      size: limit,
      total,
      totalPages,
    },
    data: result,
  };
};

const getByCategory = async (id: string, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);

  const result = await prisma.book.findMany({
    where: { categoryId: id },
    skip,
    take: limit,
    include: { category: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' },
  });

  const total = await prisma.book.count({ where: { categoryId: id } });

  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      page,
      size: limit,
      total,
      totalPages,
    },
    data: result,
  };
};

export const BookService = { insertIntoDB, getAllFromDB, getByCategory };
