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

export const OrderService = {
  insertIntoDB,
};
