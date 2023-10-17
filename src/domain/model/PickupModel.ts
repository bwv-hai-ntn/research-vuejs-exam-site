/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { PickupDetail } from './PickupDetailModel';

/**
 * define model Pickup
 */
export class Pickup extends Sequelize.Model {
  public static ASSOCIATE() {
    Pickup.hasMany(PickupDetail);
  }
  public readonly id: number;
  public title: string;
  public note?: string;
  public pageDescription?: string;
  public sort: number;
  public displayTop: boolean;
  public postPeriodFrom?: Date;
  public postPeriodTo?: Date;
  public imagePath?: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
  public pickupDetail?: PickupDetail[];
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Pickup.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      title: {
        allowNull: false,
        type: dt.STRING(100)
      },
      note: {
        type: dt.STRING(200)
      },
      pageDescription: {
        type: dt.TEXT
      },
      sort: {
        allowNull: false,
        type: dt.INTEGER.UNSIGNED
      },
      displayTop: {
        allowNull: false,
        type: dt.BOOLEAN
      },
      postPeriodFrom: {
        type: dt.DATE
      },
      postPeriodTo: {
        type: dt.DATE
      },
      imagePath: {
        type: dt.STRING(256)
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'pickup',
      paranoid: true,
      name: { singular: 'pickup', plural: 'pickup' }
    }
  );

  return Pickup;
};
