/**
 * Express Application
 */
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressEjsLayouts from 'express-ejs-layouts';
import * as session from 'express-session';

// tslint:disable-next-line:no-import-side-effect
import './LoadEnv';
import './sequelize';

import 'reflect-metadata';

import errorHandler from './middlewares/errorHandler';
import router from './router';

const app = express();
app.set('views', `${__dirname}/../views`);
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('layout extractScripts', true);
app.set('layout', 'layout/default');
app.use(bodyParser.json());
app.use(cookieParser());
app.enable('trust proxy');

// The extended option allows to choose between parsing the URL-encoded data
// with the querystring library (when false) or the qs library (when true).
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: <string>process.env.SESSION_SECRET || 'session_secret',
    resave: true,
    saveUninitialized: true,
    // tslint:disable-next-line:no-magic-numbers
    cookie: { maxAge: Number(process.env.SESSION_MAX_AGE || '86400000') }
  })
);

app.use(express.static(`${__dirname}/../public`));
app.use(router);
app.use(errorHandler);

export = app;
