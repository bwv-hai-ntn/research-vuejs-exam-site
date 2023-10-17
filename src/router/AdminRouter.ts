/**
 * Talk Router
 */
import { Router } from 'express';
import auth from '../middlewares/authenticationAdmin';
import viewHelper from '../middlewares/viewHelper';
import answerRouter from './admin/AnswerListRouter';
import categoryRouter from './admin/CategoryListRouter';
import examRouter from './admin/ExamListRouter';
import fileRouter from './admin/FileRouter';
import questionRouter from './admin/QuestionRouter';
import userRouter from './admin/UserListRouter';

const adminRouter = Router();
adminRouter.use(viewHelper);
adminRouter.use(auth);

adminRouter.use(
  '/admin',
  examRouter,
  answerRouter,
  questionRouter,
  categoryRouter,
  userRouter,
  fileRouter
);

export default adminRouter;
