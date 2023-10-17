/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Exam } from './ExamModel';
import { Pickup } from './PickupModel';

/**
 * define model PickupDetail
 */
export class PickupDetail extends Sequelize.Model {
  public static ASSOCIATE() {
    PickupDetail.belongsTo(Pickup);
    PickupDetail.belongsTo(Exam);
  }
  public readonly id: number;
  public pickupId: number;
  public examId: number;
  public title?: string;
  public note?: string;
  public sort: number;
  public postPeriodFrom?: Date;
  public postPeriodTo?: Date;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
  public exam?: Exam;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  PickupDetail.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      pickupId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      examId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      title: {
        type: dt.STRING(200)
      },
      note: {
        type: dt.STRING(200)
      },
      sort: {
        allowNull: false,
        type: dt.INTEGER.UNSIGNED
      },
      postPeriodFrom: {
        type: dt.DATE
      },
      postPeriodTo: {
        type: dt.DATE
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'pickupDetail',
      paranoid: true,
      name: { singular: 'pickupDetail', plural: 'pickupDetail' }
    }
  );

  return PickupDetail;
};
