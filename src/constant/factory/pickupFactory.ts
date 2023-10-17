import { ICommonSearchOption } from '../index';

export interface ISearchListPickup extends ICommonSearchOption {
  limit?: number | string;
  limitDetail?: number | string;
}
