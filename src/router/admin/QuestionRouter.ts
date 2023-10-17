/**
 * Question Router
 */
import { Router } from 'express';
import ExamController from '../../controllers/admin/ExamController';
import QuestionController from '../../controllers/admin/QuestionController';
import viewHelper from '../../middlewares/viewHelper';

const questionRouter = Router();

questionRouter.use(viewHelper);

questionRouter.get(
  '/examQuestions/:examId([0-9]+)',
  QuestionController.createEdit
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/addSection/:sectionsCount',
  QuestionController.addSection
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/deleteSection/:sectionId([0-9]+)',
  QuestionController.deleteSection
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/addData',
  QuestionController.addData
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/sortData',
  QuestionController.sortData
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/updateQuestion',
  QuestionController.updateQuestion
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/updateQuestionOption',
  QuestionController.updateQuestionOption
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/updateExamSection',
  QuestionController.updateExamSection
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/removeOption/:optionId([0-9]+)',
  QuestionController.removeOption
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/removeQuestion/:questionId([0-9]+)',
  QuestionController.removeQuestion
);

questionRouter.post(
  '/question/:examId([0-9]+)/revert',
  QuestionController.revertExam
);

questionRouter.post('/question/:examId([0-9]+)/copy', ExamController.copyExam);

questionRouter.post(
  '/question/:examId([0-9]+)/delete',
  ExamController.deleteExam
);

questionRouter.post(
  '/examQuestions/:examId([0-9]+)/addSectionPopup',
  QuestionController.addSectionPopup
);

export default questionRouter;
