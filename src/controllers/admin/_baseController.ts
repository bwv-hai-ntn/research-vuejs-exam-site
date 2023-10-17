import * as crypto from 'crypto';
import { Request } from 'express';
import { Static } from './../../constant';

export default abstract class BaseController {
  protected getOffsetLimit(req: Request) {
    const page = Number(req.query.offset);

    const limit = Number(req.query.limit);
    if (
      !isNaN(limit) &&
      req.query.limit !== undefined &&
      req.query.limit !== null &&
      req.query.limit !== ''
    ) {
      if (!isNaN(page) && page > 0) {
        const offset = page * limit - limit;
        return { offset, limit };
      } else {
        return { offset: 0, limit };
      }
    } else {
      return { offset: 0, limit: '' };
    }
  }

  /**
   * get header data
   */
  protected getHeaderData(req: Request) {
    const headerData = {
      userName: req.session!.admin.userName,
      userImage: req.session!.passport.user.picture,
      userAuthor: Static.authority[req.session!.admin.userFlag]
    };

    return headerData;
  }

  /**
   * Generate strings with custom length characters [a-z] [A-Z] [0-9]
   */
  protected generateRandomKey(length: string | number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Encrypt string
   */
  protected hashSha256(string: string) {
    const randomSalt = process.env.HASH_SECRET || 'hash_secret';
    const hashedString = crypto
      .createHmac('sha256', randomSalt)
      .update(string)
      .digest('hex');

    return hashedString;
  }
}
