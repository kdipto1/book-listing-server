import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BookService } from './book.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully!',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'search',
    'title',
    'author',
    'genre',
    'minPrice',
    'maxPrice',
    'category',
  ]);

  const options = pick(req.query, ['page', 'size', 'sortBy', 'sortOrder']);
  const result = await BookService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully!',
    data: result,
  });
});

const getByCategory = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['page', 'size', 'sortBy', 'sortOrder']);
  const result = await BookService.getByCategory(
    req.params.categoryId,
    options,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully!',
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetched successfully!',
    data: result,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.updateById(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully!',
    data: result,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.deleteById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book is deleted successfully!',
    data: result,
  });
});

export const BookController = {
  insertIntoDB,
  getAllFromDB,
  getByCategory,
  getById,
  updateById,
  deleteById,
};
