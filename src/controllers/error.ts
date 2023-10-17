/**
 * Error Controller
 */
import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';

export const notFoundTop = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.originalUrl.startsWith('/admin/')) {
    return res.redirect(`/?redirect=${encodeURIComponent(req.originalUrl)}`);
  }

  next();
};

export const notFound = (_req: Request, res: Response) => {
  return res.status(NOT_FOUND).render('errors/404');
};
