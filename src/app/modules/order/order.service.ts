import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (
  user: JwtPayload | null,
  payload: Partial<Order>,
) => {
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid order request');
  if (!payload.orderedBooks)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid order request');
  const oderData = {
    userId: user.userId,
    orderedBooks: payload.orderedBooks,
  };
  const result = await prisma.order.create({
    data: oderData,
  });
  return result;
};

const getAllFromDB = async (user: JwtPayload | null) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  if (user.role === 'admin') {
    const result = await prisma.order.findMany();
    return result;
  }
  if (user.role === 'customer') {
    const result = await prisma.order.findMany({
      where: {
        userId: user.userId,
      },
    });
    return result;
  }
};

const getById = async (id: string, user: JwtPayload | null) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  if (user.role === 'admin') {
    const result = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }
  if (user.role === 'customer') {
    const result = await prisma.order.findUniqueOrThrow({
      where: {
        id,
        userId: user.userId,
      },
    });
    return result;
  }
};

export const OrderService = {
  insertIntoDB,
  getAllFromDB,
  getById,
};
