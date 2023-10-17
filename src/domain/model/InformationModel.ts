/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';

/**
 * define model Information
 */
export class Information extends Sequelize.Model {
  public static ASSOCIATE() {
    //
  }
  public readonly id: number;
  public title: string;
  public description: string;
  public mandatory: boolean;
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
  Information.init(
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
      description: {
        allowNull: false,
        type: dt.TEXT
      },
      mandatory: {
        allowNull: false,
        type: dt.BOOLEAN
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
      tableName: 'information',
      paranoid: true,
      name: { singular: 'information', plural: 'information' }
    }
  );

  return Information;
};
