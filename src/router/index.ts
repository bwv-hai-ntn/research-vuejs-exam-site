/**
 * Main Router
 */
import { Router } from 'express';
import * as passport from 'passport';
// tslint:disable-next-line:no-submodule-imports
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import {
  notFound as notFoundHandler,
  notFoundTop as notFoundTopHandler
} from '../controllers/error';
import sessionMiddleWare, {
  handlerSessionSearch
} from '../middlewares/session';
import userMiddleware from '../middlewares/user';
import adminRouter from './AdminRouter';
import loginAdminRouter from './LoginAdminRouter';
import loginRouter from './LoginRouter';
import mainRouter from './MainRouter';

import * as TopController from '../controllers/TopController';
import viewHelper from '../middlewares/viewHelper';
import informationRouter from './InformationRouter';
import pickupRouter from './PickupRouter';
import recommendationRouter from './RecommendationRouter';
import searchRouter from './SearchRouter';

const router = Router();

router.use('/search', searchRouter);

router.use('/', pickupRouter);
router.use('/', informationRouter);
router.use('/', recommendationRouter);
router.get('/', viewHelper, TopController.index);

router.use(handlerSessionSearch);
router.use(sessionMiddleWare);
router.use(userMiddleware);
router.use(passport.initialize());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENT_ID!,
      clientSecret: process.env.GG_CLIENT_SECRET!,
      callbackURL: '/login/auth/google',
      proxy: true
    },
    // tslint:disable-next-line:variable-name
    async (_accessToken, _refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);
router.use('/login', loginRouter);
router.use('/admin', loginAdminRouter);
router.use('/', mainRouter);

// redirect to TOP when not found error
router.use(notFoundTopHandler);

router.use('/', adminRouter);

// 404 error
router.use(notFoundHandler);

export default router;
