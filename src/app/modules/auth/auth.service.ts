import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: User) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await prisma.user.create({
    data: payload,
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

const signin = async (payload: Partial<User>): Promise<string> => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const { id: userId, role } = isUserExists;
  if (!payload.password && !payload.password?.length)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists.password,
  );
  if (!isPasswordMatched)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password!');

  const token = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return token;
};

export const AuthService = { insertIntoDB, signin };
