/**
 * 認証ミドルウェア
 */

import { NextFunction, Request, Response } from 'express';

export default async (_req: Request, _res: Response, next: NextFunction) => {
  // if (!req.user) {
  //   const redirectURL = '/login';
  //   (<Express.Session>req.session).redirect = req.originalUrl;
  //   res.redirect(redirectURL);
  // } else {
  next();
  // }
};
