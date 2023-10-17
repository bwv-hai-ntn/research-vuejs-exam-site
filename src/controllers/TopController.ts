/**
 * Top controller
 */
import { NextFunction, Request, Response } from 'express';
import { truncate } from '../utils/common';

export const index = async (_: Request, res: Response, next: NextFunction) => {
  try {
    return res.render('top/index', {
      truncate,
      layout: 'layout/userLayout'
    });
  } catch (err) {
    next(err);
  }
};
