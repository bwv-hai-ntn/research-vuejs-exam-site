/**
 * エラーハンドラーミドルウェア
 */

import * as createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} from 'http-status';

const debug = createDebug('web-admin:middleware:errorHandler');

export default (err: any, _req: Request, res: Response, __: NextFunction) => {
  debug(err.message);
  const error = `${err.message}`;
  let status = BAD_REQUEST;
  if (err.response !== undefined) {
    status = err.response.status;

    if (status === NOT_FOUND) {
      res.redirect('/errors/404');
      return;
    }
  }

  // error auth google
  if (err.status && err.status === INTERNAL_SERVER_ERROR) {
    res.redirect('/errors/404');
    return;
  }

  // id not found
  if (err.NOT_FOUND === NOT_FOUND) {
    let layout = '';
    // with admin layout
    if (err.user === undefined) {
      layout = 'layout/adminLayout';
    }
    res.status(NOT_FOUND).render('errors/404', { layout });
    return;
  }

  // FORBIDDEN
  if (err.FORBIDDEN === FORBIDDEN) {
    res
      .status(FORBIDDEN)
      .render('errors/403', { layout: 'layout/adminLayout' });
    return;
  }

  res.status(BAD_REQUEST).render('errors/error', {
    error
  });
};
