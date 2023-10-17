import * as moment from 'moment-timezone';
import { FindOptions, IncludeOptions, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import { types } from './../../constant';
import BaseRepository from './BaseRepo';

export default class PickupRepository extends BaseRepository {
  public readonly model: DB['Pickup'];
  constructor(db: DB) {
    super(db);
    this.model = db.Pickup;
  }

  public async searchPickupId(pickupId: number | string) {
    const pickup = await this.model.findOne(this.makeFindIdOption(pickupId));
    return pickup;
  }

  public async searchPickup(params: types.pickup.searchListPickup) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    const pickups = await this.model.findAll(findOption);

    return pickups;
  }

  private makeFindIdOption(pickupId: number | string) {
    const currentDateTime = moment()
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');

    // Join with exam table
    const examInclude: IncludeOptions = {
      model: this.db.Exam,
      where: { deletedAt: null },
      attributes: ['title', 'description', 'accessKey'],
      required: false
    };
    // Join with pickupDetail table
    const pickupDetailInclude: IncludeOptions = <IncludeOptions>{
      model: this.db.PickupDetail,
      where: {
        deletedAt: null,
        [Op.and]: [
          Sequelize.literal(`
        (\`pickupDetail\`.\`postPeriodFrom\` is null or \`pickupDetail\`.\`postPeriodFrom\` <= '${currentDateTime}')
        `),
          Sequelize.literal(`
        (\`pickupDetail\`.\`postPeriodTo\` is null or \`pickupDetail\`.\`postPeriodTo\` >= '${currentDateTime}')
        `)
        ]
      },
      attributes: ['title', 'note'],
      order: [['sort', 'ASC']],
      required: false,
      include: [examInclude]
    };
    const findOption: FindOptions = <FindOptions>{
      where: {
        id: pickupId,
        deletedAt: null,
        [Op.and]: [
          Sequelize.literal(`
        (\`Pickup\`.\`postPeriodFrom\` is null or \`Pickup\`.\`postPeriodFrom\` <= '${currentDateTime}')
        `),
          Sequelize.literal(`
        (\`Pickup\`.\`postPeriodTo\` is null or \`Pickup\`.\`postPeriodTo\` >= '${currentDateTime}')
        `)
        ]
      },
      attributes: ['id', 'pageDescription', 'title', 'note', 'imagePath'],
      include: [pickupDetailInclude],
      order: [[this.db.PickupDetail, 'sort', 'ASC']]
    };

    return findOption;
  }

  private makeFindOption(params: types.pickup.searchListPickup) {
    const currentDateTime = moment()
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');

    // Join with pickupDetail table
    const pickupDetailInclude: IncludeOptions = <IncludeOptions>{
      model: this.db.PickupDetail,
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
      attributes: ['examId', 'title', 'note'],
      order: [['sort', 'ASC']],
      required: false,
      limit: params.limitDetail ? Number(params.limitDetail!) : undefined
    };
    const findOption: FindOptions = <FindOptions>{
      where: {
        displayTop: true,
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
      attributes: ['pageDescription', 'title', 'note'],
      include: [pickupDetailInclude],
      order: [['sort', 'ASC']]
    };

    return findOption;
  }
}
