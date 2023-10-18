import { ICommonSearchOption } from '../index';
export interface ISearchListProducts extends ICommonSearchOption {
  productName?: string;
  featuredFlg?: (string | number)[] | any[];
  priceFrom?: string;
  priceTo?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}