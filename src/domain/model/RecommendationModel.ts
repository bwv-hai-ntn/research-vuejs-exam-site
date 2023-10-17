/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';

/**
 * define model Recommendation
 */
export class Recommendation extends Sequelize.Model {
  public static ASSOCIATE() {
    //
  }
  public readonly id: number;
  public title: string;
  public note?: string;
  public imagePath?: string;
  public redirectUrl?: string;
  public sort: number;
  public postPeriodFrom?: Date;
  public postPeriodTo?: Date;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Recommendation.init(
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
      imagePath: {
        type: dt.STRING(256)
      },
      redirectUrl: {
        type: dt.STRING(256)
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
      tableName: 'recommendation',
      paranoid: true,
      name: { singular: 'recommendation', plural: 'recommendation' }
    }
  );

  return Recommendation;
};
