import { Sequelize } from 'sequelize';
import { DB } from '../model';
import BaseRepository from './BaseRepo';

export default class ExamQuestionOptionRepository extends BaseRepository {
  public readonly model: DB['ExamQuestionOption'];
  constructor(db: DB) {
    super(db);
    this.model = db.ExamQuestionOption;
  }

  /**
   * find max sort
   * @param examSectionId
   */
  public async getMaxOrder(examQuestionId: string | number) {
    const option = await this.model.findOne({
      where: { examQuestionId },
      attributes: [[Sequelize.fn('max', Sequelize.col('sort')), 'sort']]
    });

    return option ? option.sort || 0 : 0;
  }
}
