/**
 * ユーザーミドルウェア
 */
import { NextFunction, Request, Response } from 'express';
// import { UNAUTHORIZED } from 'http-status';

export default async (req: Request, res: Response, next: NextFunction) => {
  const userSession = req.session === undefined ? undefined : req.session.user;
  if (userSession === undefined) {
    next();
  } else {
    req.user = {
      ...userSession,
      isAuthorized: true,
      destroy: () => {
        (<Express.Session>req.session).user = undefined; // ユーザーセッションを削除
      }
    };
    res.locals = {
      user: req.user
    }; // レイアウトに使ってる
    next();
  }
};
