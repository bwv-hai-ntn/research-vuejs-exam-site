import * as moment from 'moment-timezone';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import { types } from './../../constant';
import BaseRepository from './BaseRepo';

export default class InformationRepository extends BaseRepository {
  public readonly model: DB['Information'];
  constructor(db: DB) {
    super(db);
    this.model = db.Information;
  }

  public async searchInformation(
    params: types.information.searchListInformation
  ) {
    const findOption = this.makeFindOption();
    this.setOffsetLimit(findOption, params);
    const informations = await this.model.findAll(findOption);
    return informations;
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
      attributes: ['id', 'title', 'description', 'mandatory', 'sort'],
      order: [['sort', 'ASC']]
    };

    return findOption;
  }
}
