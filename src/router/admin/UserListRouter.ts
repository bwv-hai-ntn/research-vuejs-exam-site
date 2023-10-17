/**
 * User Router
 */
import { Router } from 'express';
import UserController from '../../controllers/admin/UserController';

const userRouter = Router();

userRouter.get('/user', UserController.list);

userRouter.get('/user/searchUser', UserController.searchUser);
userRouter.post('/user', UserController.createUpdateUser);
userRouter.post('/user/:id([0-9]+)/delete', UserController.deleteUser);
userRouter.post('/user/check', UserController.checkUser);
userRouter.post('/user/category', UserController.createUpdateCategory);
export default userRouter;
