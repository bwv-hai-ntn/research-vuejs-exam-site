/**
 * セッションミドルウェア
 */

import { NextFunction, Request, Response } from 'express';
import * as url from 'url';

export default async (req: Request, _: Response, next: NextFunction) => {
  req.consumeSession = () => {
    let formData;
    if ((<Express.Session>req.session).formData !== undefined) {
      formData = { ...(<Express.Session>req.session).formData };
    }
    let message: string | undefined;
    if ((<Express.Session>req.session).message !== undefined) {
      message = { ...(<Express.Session>req.session).message };
    }
    (<Express.Session>req.session).formData = undefined;
    (<Express.Session>req.session).message = undefined;
    return { formData, message };
  };
  next();
};

export const handlerSessionSearch = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const parsedUrl = url.parse(req.url);
  if (
    req.session?.conditionsAnswerList &&
    req.method === 'GET' &&
    parsedUrl.pathname
  ) {
    if (
      /^\/admin\/answer\/([0-9]+)\/view$/.test(parsedUrl.pathname) === false &&
      /^\/admin\/answer\/([0-9]+)$/.test(parsedUrl.pathname) === false &&
      /^\/admin\/answer\/([0-9]+)\/view\/([0-9]+)$/.test(parsedUrl.pathname) ===
        false &&
      /^\/admin\/answer\/([0-9]+)\/briswell.com\/([0-9]+)$/.test(
        parsedUrl.pathname
      ) === false &&
      parsedUrl.pathname !== '/admin/answer/search'
    ) {
      if (parsedUrl.pathname !== '/js/lib/moment.min.js.map') {
        delete req.session.conditionsAnswerList;
      }
    }
  }
  next();
};
