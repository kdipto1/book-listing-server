import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.insertIntoDB(req.body);
  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created!',
    data: result,
  });
});

export const UserController = { insertIntoDB };
