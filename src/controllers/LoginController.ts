/**
 * Main controller
 */
import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';

/**
 * GET Login
 */
export const login = (__: Request, res: Response, _next: NextFunction) => {
  res.render('login/index', {
    //
  });
};

export const auth = (req: Request, res: Response, _next: NextFunction) => {
  // TODO: Can not set the session value between before Google Login to after Login.
  // Change to using cookie. If there is another solution, change it without using cookie.
  // const loginType = req.session!.loginType;
  const loginUserType = req.cookies.loginUserType;
  if (loginUserType === 'admin') {
    (<Express.Session>req.session).admin = req.user;
    // req.session!.loginType;
    res.clearCookie('loginUserType');
    res.redirect('/admin/login/auth/google');
  } else {
    (<Express.Session>req.session).user = req.user;
    res.redirect(req.session!.redirect || '/');
  }
};
