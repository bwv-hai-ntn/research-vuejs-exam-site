/**
 * Login Router
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';
import * as loginAdminController from '../controllers/LoginAdminController';
import viewHelper from '../middlewares/viewHelper';

const loginAdminRouter = Router();
loginAdminRouter.use(viewHelper);
loginAdminRouter.post(
  '/login/google',
  async (_: Request, res: Response, next: NextFunction) => {
    // TODO: Can not set the session value between before Google Login to after Login.
    // Change to using cookie. If there is another solution, change it without using cookie.
    // (<Express.Session>req.session).loginType = 'admin';
    res.cookie('loginUserType', 'admin');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);
loginAdminRouter.get('/login', loginAdminController.login);

loginAdminRouter.get('/login/auth/google', loginAdminController.auth);
loginAdminRouter.get('/logout', loginAdminController.logout);

export default loginAdminRouter;
