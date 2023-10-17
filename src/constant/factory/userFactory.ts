import { ICommonSearchOption } from '../index';

export interface ISearchListUser extends ICommonSearchOption {
  userName?: string;
  email?: string;
  accessKey?: string;
  authority?: string | number | any[];
  category?: number | string;
}

export interface ICreateUser {
  id: number | string;
  userNameEdit?: string;
  emailEdit?: string;
  authorityEdit?: string;
}

export interface ISaveUserCategory {
  userId: string | number;
  cbxCategory: [number | string];
}
