import { Transform } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';

const colType: { [key: string]: string } = {
  priceFrom: 'number',
  priceTo: 'number'
};

const isOfType = (value: any, type: string) => {
  switch (type) {
    case 'number':
      return !isNaN(value);
    default:
      break;
  }

  return true;
};

const config = (query: any) => {
  const entries = Object.entries(query);

  for (const [key, val] of entries) {
    if (colType[key] && !isOfType(val, colType[key])) {
      return false;
    }
  }

  return true;
};

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!isEmpty(req.query.data)) {
    if (!config(req.query.data)) {
      (<Express.Session>req.session).isInvalid = true;
    }
  }

  next();
};

export class TransformerParamsSearchAPI {
  @Transform(({ value }) => (isNaN(value) ? (value = Number.MAX_VALUE) : value))
  priceFrom: number;

  @Transform(({ value }) => (isNaN(value) ? (value = Number.MIN_VALUE) : value))
  priceTo: number;
}
