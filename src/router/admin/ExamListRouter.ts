/**
 * Exam Router
 */
import { Router } from 'express';
import ExamController from '../../controllers/admin/ExamController';
import viewHelper from '../../middlewares/viewHelper';

const examRouter = Router();

examRouter.use(viewHelper);

examRouter.get('/exam', ExamController.examlist);

examRouter.get('/examSettings/:examId([0-9]+)', ExamController.examCreateEdit);
examRouter.get('/examSettings', ExamController.examCreateEdit);
examRouter.get(
  '/examSettings/recalculate/:examId([0-9]+)',
  ExamController.recalculate
);
examRouter.get(
  '/examSettings/checkAccessKey/:accessKey',
  ExamController.checkAccessKey
);
examRouter.post(
  '/examSettings/:examId([0-9]+)/update',
  ExamController.updateExam
);
examRouter.post('/examSettings/update', ExamController.updateExam);
examRouter.post('/examSettings/:examId([0-9]+)/copy', ExamController.copyExam);
examRouter.post(
  '/examSettings/:examId([0-9]+)/delete',
  ExamController.deleteExam
);
examRouter.post(
  '/examSettings/:examId([0-9]+)/revert',
  ExamController.revertExam
);

examRouter.post('/exam/deleteAndRevert', ExamController.deleteAndRevert);

examRouter.post('/exam/saveExamCategory', ExamController.saveExamCategory);

examRouter.get('/exam/searchExam', ExamController.searchExam);

export default examRouter;
