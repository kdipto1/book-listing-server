import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (payload: User) => {
  payload.password = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const result = await prisma.user.create({
    data: payload,
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
  const token = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return token;
};

export const UserService = { insertIntoDB, signin };
