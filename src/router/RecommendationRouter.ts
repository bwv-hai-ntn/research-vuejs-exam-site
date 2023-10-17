/**
 * Recommendation Router
 */
import { Router } from 'express';
import * as RecommendationController from '../controllers/RecommendationController';
import viewHelper from '../middlewares/viewHelper';

const recommendationRouter = Router();

recommendationRouter.use(viewHelper);

recommendationRouter.get(
  '/getRecommendation',
  RecommendationController.getRecommendation
);

export default recommendationRouter;
