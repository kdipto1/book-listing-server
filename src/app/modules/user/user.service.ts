import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getAllFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });
  return result;
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id: id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });
  return result;
};

const updateById = async (id: string, payload: Partial<User>) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!isUserExists)
    throw new ApiError(httpStatus.NOT_EXTENDED, 'User not found with this id');
  const result = prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name || undefined,
      email: payload.email || undefined,
      contactNo: payload.contactNo || undefined,
      address: payload.address || undefined,
      profileImg: payload.profileImg || undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });
  return result;
};

const deleteById = async (id: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!isUserExists)
    throw new ApiError(httpStatus.NOT_EXTENDED, 'User not found with this id');
  if (isUserExists && isUserExists.role === 'customer') {
    await prisma.order.deleteMany({
      where: {
        userId: isUserExists.id,
      },
    });
  }
  const result = await prisma.user.delete({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });
  return result;
};

export const UserService = {
  getAllFromDB,
  getByIdFromDB,
  updateById,
  deleteById,
};
