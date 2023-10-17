/**
 * Main controller
 */
import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import * as Url from 'url';
import { messages } from '../constant';
import { repository } from '../domain';
import sequelize from '../sequelize';

const userRepo = new repository.User(sequelize);

/**
 * GET Login
 */
export const login = (req: Request, res: Response, _next: NextFunction) => {
  const errorLoginMessage = req.session!.errorLogin;
  delete req.session!.errorLogin;
  res.render('login/indexAdmin', {
    message: errorLoginMessage
  });
};

export const auth = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const adminUser = req.session!.admin;
  // get user
  const users = await userRepo.searchUser(adminUser!.email);
  if (users.length !== 1) {
    (<Express.Session>req.session).errorLogin = messages.loginError;
    delete req.session!.admin;
    res.redirect('/admin/login');
  } else {
    (<Express.Session>req.session).admin = {
      id: users[0]!.id,
      userName: users[0]!.userName,
      userFlag: users[0]!.authority
    };
    if (req.session!.redirectUrl !== undefined) {
      req.query.redirect =
        req.session!.redirectUrl.length === 0 ||
        req.session!.redirectUrl.length === 1 ||
        req.session!.redirectUrl.indexOf('/admin/') === -1
          ? '/admin/exam'
          : req.session!.redirectUrl;
      res.redirect(decodeURIComponent(<string>req.query.redirect));
    } else {
      res.redirect('/admin/exam');
    }
  }
};

/**
 * GET logout
 */
export const logout = async (req: Request, res: Response) => {
  delete req.session!.admin;
  let redirectURL = '/admin/login';
  const referer = req.headers.referer;
  if (referer !== undefined) {
    redirectURL += `?redirect=${encodeURIComponent(
      Url.parse(referer).path || ''
    )}`;
  }
  (<Express.Session>req.session).redirectUrl = referer;
  res.redirect(redirectURL);
};
