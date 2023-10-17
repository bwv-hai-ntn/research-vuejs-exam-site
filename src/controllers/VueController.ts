/**
 * Vue controller
 */
import { NextFunction, Request, Response } from 'express';

/**
 * index Screen
 */
export const index = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.render('admin/user/index', {
    layout: 'admin/vue',
    req
  });
};
