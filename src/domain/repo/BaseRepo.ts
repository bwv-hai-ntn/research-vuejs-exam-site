import * as Sequelize from 'sequelize';
import { DB } from '../model';

/**
 * Base class for other repository
 * common function is inside this class
 */
export default abstract class BaseRepository {
  public readonly db: DB;
  protected readonly extraExclude: string[] = [
    'createdAt',
    'updatedAt',
    'deletedAt'
  ];

  constructor(db: DB) {
    this.db = db;
  }

  protected setOffsetLimit(
    findOptions: Sequelize.FindOptions,
    option?: { offset?: string | number; limit?: string | number }
  ) {
    if (option !== undefined) {
      if (!isNaN(Number(option.offset)) && option.offset !== '') {
        findOptions.offset = Number(option.offset);
      }

      if (!isNaN(Number(option.limit)) && option.limit !== '') {
        findOptions.limit = Number(option.limit);
      }
    }
  }
}
