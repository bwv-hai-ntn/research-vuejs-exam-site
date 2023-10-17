/**
 * Recommendation controller
 */
import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';
import { Static } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';

const recommendationRepo = new repository.Recommendation(sequelize);

export const getRecommendation = async (_: Request, res: Response) => {
  try {
    const recommendations = await recommendationRepo.searchRecommendation({
      limit: Static.listLimit.LimitRecommendationList
    });
    return res.json({ data: recommendations });
  } catch (err) {
    return res.status(BAD_REQUEST).json({ status: 'fail' });
  }
};
