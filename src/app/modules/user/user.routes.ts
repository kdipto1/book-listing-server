import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/signup', UserController.insertIntoDB);
router.post('/signin', UserController.insertIntoDB);

export const UserRoutes = router;
