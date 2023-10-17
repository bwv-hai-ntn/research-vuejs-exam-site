import * as moment from 'moment-timezone';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import { types } from './../../constant';
import BaseRepository from './BaseRepo';

export default class RecommendationRepository extends BaseRepository {
  public readonly model: DB['Recommendation'];
  constructor(db: DB) {
    super(db);
    this.model = db.Recommendation;
  }

  public async searchRecommendation(
    params: types.recommendation.searchListRecommendation
  ) {
    const findOption = this.makeFindOption();
    this.setOffsetLimit(findOption, params);
    const recommendations = await this.model.findAll(findOption);
    return recommendations;
  }

  private makeFindOption() {
    const currentDateTime = moment()
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');

    const findOption: FindOptions = <FindOptions>{
      where: {
        deletedAt: null,
        [Op.and]: [
          Sequelize.literal(`
        (postPeriodFrom is null or postPeriodFrom <= '${currentDateTime}')
        `),
          Sequelize.literal(`
        (postPeriodTo is null or postPeriodTo >= '${currentDateTime}')
        `)
        ]
      },
      attributes: [
        'imagePath',
        'title',
        'note',
        'postPeriodFrom',
        'redirectUrl'
      ],
      order: [['sort', 'ASC']]
    };

    return findOption;
  }
}
