/**
 * Login Router
 */
import { NextFunction, Request, Response, Router } from 'express';
import * as passport from 'passport';
import * as loginController from '../controllers/LoginController';
import viewHelper from '../middlewares/viewHelper';

const loginRouter = Router();

loginRouter.use(viewHelper);
loginRouter.post(
  '/google',
  async (_req: Request, res: Response, next: NextFunction) => {
    // TODO: Can not set the session value between before Google Login to after Login.
    // Change to using cookie. If there is another solution, change it without using cookie.
    // (<Express.Session>req.session).loginType = 'user';
    res.cookie('loginUserType', 'user');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);
loginRouter.get(
  '/auth/google',
  passport.authenticate('google'),
  loginController.auth
);

export default loginRouter;
