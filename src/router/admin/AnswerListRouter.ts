/**
 * Exam Router
 */
import { Router } from 'express';
import AnswerController from '../../controllers/admin/AnswerController';
import ExamController from '../../controllers/admin/ExamController';
import viewHelper from '../../middlewares/viewHelper';

const answerRouter = Router();

answerRouter.use(viewHelper);

answerRouter.get('/answer/:examId([0-9]+)', AnswerController.answerlist);
answerRouter.get('/answer/search', AnswerController.searchAnswerlist);
answerRouter.get('/answer/:answerId/view', AnswerController.answerView);
answerRouter.post('/answer/:answerId([0-9]+)', AnswerController.deleteAnswer);
answerRouter.post(
  '/answer/:examId([0-9]+)/revert',
  AnswerController.revertExam
);
answerRouter.post('/answer/sendEmail', AnswerController.sendEmail);
answerRouter.post('/answer/:examId([0-9]+)/copy', ExamController.copyExam);
answerRouter.post('/answer/:examId([0-9]+)/delete', ExamController.deleteExam);
export default answerRouter;
