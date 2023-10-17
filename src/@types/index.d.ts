/**
 * ユーザーの型をここで定義しています。
 */
import { Request } from 'express';
import * as factory from '../constant';

declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    export interface Request {
      admin: Partial<factory.types.auth.LoginData> & {
        destroy(): void;
      };
      consumeSession<X>(): { formData?: X; message?: string };
    }
  }
}
