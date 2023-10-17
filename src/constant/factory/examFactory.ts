import { ICommonSearchOption } from '../index';

export interface ISearchListExam extends ICommonSearchOption {
  title?: string;
  description?: string;
  accessKey?: string;
  status?: string | number | any[];
  category?: number | string;
  limitFlag?: boolean | undefined;
}

export interface ISaveExamCategory {
  examId: string | number;
  cbxCategory: [];
  constCbxCategory: [];
}

export interface IMain {
  title: string;
  description?: string;
  acceptAnswer?: number;
  signinRestrict?: number;
  userRestrict?: string;
  limitResponse?: number;
  testTime?: number;
  totalPoints?: number;
  passPercentage?: number;
  showResult?: number;
  shuffleQuestion?: number;
  shuffleOption?: number;
  endMessage?: string;
  accessKey?: string;
  accessURL?: string;
}
