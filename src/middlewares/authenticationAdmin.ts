/**
 * 認証ミドルウェア
 */

import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session!.admin) {
    let redirectURL = '/admin/login';
    const originalUrl = req.originalUrl;
    if (originalUrl !== undefined) {
      redirectURL += `?redirect=${encodeURIComponent(originalUrl)}`;
    }
    (<Express.Session>req.session).redirectUrl = originalUrl;
    res.redirect(redirectURL);
  } else {
    next();
  }
};
