/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { UserCategory } from './UserCategoryModel';

/**
 * define model
 */
export class User extends Sequelize.Model {
  public static ASSOCIATE() {
    User.hasMany(UserCategory);
  }
  public readonly id: number;
  public userName: string;
  public email?: string;
  public authority?: number;
  public userCategory?: UserCategory[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      userName: {
        allowNull: false,
        type: dt.TEXT
      },
      email: {
        allowNull: false,
        type: dt.TEXT
      },
      authority: {
        allowNull: false,
        type: dt.INTEGER.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'user',
      paranoid: true,
      name: { singular: 'user', plural: 'user' }
    }
  );

  return User;
};
