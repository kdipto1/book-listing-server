import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created!',
    data: result,
  });
});

const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.signin(req.body);
      res.status(200).json({
        statusCode: httpStatus.OK,
        success: true,
        message: 'User signin successfully!',
        token: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

export const AuthController = { insertIntoDB, signin };
