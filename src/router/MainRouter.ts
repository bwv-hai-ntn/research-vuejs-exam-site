/**
 * Talk Router
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as endTestController from '../controllers/EndTestController';
import * as resultTestController from '../controllers/ResultTestController';
import * as startTestController from '../controllers/StartTestController';
import * as testingController from '../controllers/TestingController';
import * as vueController from '../controllers/VueController';
import viewHelper from '../middlewares/viewHelper';
import { messages } from './../constant';

const mainRouter = Router();

mainRouter.use(viewHelper);
mainRouter.get('/startTest/:accessKey', startTestController.startTest);
mainRouter.post('/startTest/:accessKey', startTestController.startTest);
mainRouter.post(
  '/startTest/:accessKey/:action',
  async (req: Request, _res: Response, next: NextFunction) => {
    if (req.params.action !== 'continue' && req.params.action !== 'new-test') {
      throw { message: messages.notExistExam };
    } else {
      next();
    }
  },
  startTestController.startTest
);
mainRouter.get('/testing/:accessKey', testingController.testing);
mainRouter.post('/process_testing', testingController.saveAnswer);
mainRouter.get('/endTest/:accessKey', endTestController.endTest);
mainRouter.get(
  '/resultDetail/:answerId([0-9]+)/accessToken/:accessToken',
  resultTestController.resultDetail
);

mainRouter.get('/test-vue', vueController.index);

export default mainRouter;
