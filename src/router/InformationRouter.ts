/**
 * Information Router
 */
import { Router } from 'express';
import * as InformationController from '../controllers/InformationController';
import viewHelper from '../middlewares/viewHelper';

const informationRouter = Router();

informationRouter.use(viewHelper);

informationRouter.get('/getInformation', InformationController.getInformation);

export default informationRouter;
