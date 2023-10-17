/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Category } from './CategoryModel';

/**
 * define model
 */
export class UserCategory extends Sequelize.Model {
  public static ASSOCIATE() {
    UserCategory.belongsTo(Category);
  }
  public readonly id: number;
  public userId: number;
  public categoryId: number;
  public category?: Category;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  UserCategory.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      userId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      categoryId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'userCategory',
      paranoid: true,
      name: { singular: 'userCategory', plural: 'userCategory' }
    }
  );

  return UserCategory;
};
