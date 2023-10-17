/**
 * //
 */
import * as _ from 'lodash';
import { FindOptions, IncludeOptions } from 'sequelize';
import { DB } from '../model';
import BaseRepository from './BaseRepo';

/**
 * //
 */
export default class ExamCategoryRepository extends BaseRepository {
  public readonly model: DB['ExamCategory'];
  constructor(db: DB) {
    super(db);
    this.model = db.ExamCategory;
  }

  public async checkAuthor(examId: string | number, userId: string | number) {
    const findOption: IncludeOptions = {
      where: { examId },
      include: [
        {
          model: this.db.Category,
          required: true,
          include: [{ model: this.db.UserCategory, where: { userId } }]
        }
      ]
    };

    return this.model.findAll(findOption);
  }

  public async findByConditions(
    examId: string | number,
    userId: string | number
  ) {
    const findOption = this.makeFindIdOption(examId, userId);
    const examCategory = await this.model.findAll(findOption);

    return examCategory;
  }

  private makeFindIdOption(examId: string | number, userId: string | number) {
    // join with Category table
    const categoryInclude: IncludeOptions = {
      model: this.db.Category,
      include: [
        {
          as: 'userCategoryTbl',
          model: this.db.UserCategory,
          where: {
            userId
          }
        }
      ]
    };
    const findOption: FindOptions = {
      where: { examId },
      include: [categoryInclude]
    };

    return findOption;
  }
}
