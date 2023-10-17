/**
 * ViewHelper
 */
import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as url from 'url';
import { messages, Static } from './../constant';

export default async (req: Request, res: Response, next: NextFunction) => {
  res.locals.domain = `${req.protocol}://${req.get('host')}`;
  res.locals.nodeEnv = process.env.NODE_ENV;

  /**
   * headerData
   */
  res.locals.adminInfo = req.session!.admin
    ? {
        userName: req.session!.admin!.userName,
        userImage: req.session!.passport!.user!.picture,
        userAuthor: Static.authority[req.session!.admin!.userFlag]
      }
    : {};

  /**
   * message
   */
  res.locals.messageList = messages;

  /**
   * static
   */
  res.locals.static = Static;

  /**
   * nl2br
   */
  function nl2br(str: string, isXhtml: boolean = false) {
    if (str === undefined || str === null) {
      return '';
    }
    const breakTag = isXhtml ? '<br />' : '<br>';
    return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
  }
  res.locals.nl2br = nl2br;

  function numberFormat(x: string | number) {
    try {
      const amount = `${x}`;
      const parts = amount.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (parts[1] !== undefined) {
        parts[1] = parts[1].slice(0, 2);
      }
      return parts.join('.');
    } catch (_) {
      return '';
    }
  }
  res.locals.numberFormat = numberFormat;

  /**
   * replace javascript tag
   * @param text
   * @returns String
   */
  function disableScript(text?: string) {
    let str = '';
    try {
      if (!_.isEmpty(text)) {
        str = text!
          .replace(/script>/g, 'script&gt;')
          .replace(/<script/g, '&lt;script')
          .replace(/<\/script/g, '&lt;/script');
      }
    } catch (_) {
      //
    }

    return str;
  }
  res.locals.disableScript = disableScript;

  /**
   * Date time format
   * @param object DateTime object
   * @param format Specifies the format for the date
   */
  function dateFormat(object: string, format: string = 'YYYY/MM/DD') {
    if (object === null || object === '') {
      return '';
    }
    return moment(object)
      .tz('Asia/Ho_Chi_Minh')
      .format(format);
  }
  res.locals.dateFormat = dateFormat;

  /**
   * set time japan and vietnames
   * @param object string
   * @param format string
   * @param country number
   */
  function dateFormatCountry(
    object: string,
    opt: {
      format?: string;
      country?: number;
      isShowTZ?: boolean;
    }
  ) {
    if (object === null || object === '') {
      return '';
    }
    let timeZone = '';
    const date = moment(object);
    if (opt.country && Static.country.Japan === Number(opt.country)) {
      timeZone = '(UTC+09:00)';
      date.tz('Asia/Tokyo');
    } else {
      timeZone = '(UTC+07:00)';
      date.tz('Asia/Ho_Chi_Minh');
    }
    return `${date.format(opt.format || 'YYYY/MM/DD')} ${
      opt.isShowTZ ? timeZone : ''
    }`;
  }
  res.locals.dateFormatCountry = dateFormatCountry;

  /**
   * get url current
   */
  function getUrlCurrent() {
    const parsedUrl = url.parse(req.url);
    return parsedUrl.pathname;
  }
  res.locals.getUrlCurrent = getUrlCurrent;

  function truncate(str: string, length: number) {
    if (!_.isNil(str)) {
      str = str.replace(/\r\n/g, '');
      if (str.length > length) {
        return `${str.substr(0, length)}...`;
      }
    }

    return str;
  }

  res.locals.truncate = truncate;

  next();
};
