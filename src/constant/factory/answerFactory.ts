import { ICommonSearchOption } from '../index';
import * as examFactory from './examFactory';
export interface ISearchListAnswer extends ICommonSearchOption {
  examId: number | string;
  examName?: string;
  examEmail?: string;
  status?: string | number | any[];
  totalFrom?: string;
  totalTo?: string;
  percentageFrom?: string;
  percentageTo?: string;
  result?: string | number | any[];
}

export interface IDataUpdate {
  completedTest: number;
  name: string | null;
  totalScore: number | null;
  scorePercentage: number | null;
  passExam: number | null;
  accessToken: string | null;
  expiredAt: Date | null;
  exam: examFactory.IMain | null;
  country: string | number;
  email: string | null;
  id?: string | number;
}
