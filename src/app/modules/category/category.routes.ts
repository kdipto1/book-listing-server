import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.insertIntoDB,
);
router.get('/', CategoryController.getAllFromDB);
router.get('/:id', CategoryController.getById);
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), CategoryController.updateById);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteById,
);

export const CategoryRoutes = router;
