/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
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

const getById = async (id: string) => {
  const result = await prisma.book.delete({
    where: {
      id: id,
    },
  });
  return result;
};

const updateById = async (id: string, payload: Partial<Book>) => {
  const isBookExists = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
  if (!isBookExists)
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Book not found with this id');
  const result = await prisma.book.update({
    where: { id: id },
    data: payload,
  });
  return result;
};

const deleteById = async (id: string) => {
  const isBookExists = await prisma.book.findUnique({
    where: {
      id: id,
    },
  });
  if (!isBookExists)
    throw new ApiError(httpStatus.NOT_EXTENDED, 'Book not found with this id');
  const result = await prisma.book.delete({
    where: { id: id },
    select: {
      id: true,
      title: true,
      author: true,
      genre: true,
      price: true,
      publicationDate: true,
      categoryId: true,
    },
  });
  return result;
};

export const BookService = {
  insertIntoDB,
  getAllFromDB,
  getByCategory,
  getById,
  updateById,
  deleteById,
};
