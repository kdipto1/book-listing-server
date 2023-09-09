import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const getProfile = async (user: JwtPayload | null) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.userId,
    },
    select: {
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

export const ProfileService = { getProfile };
