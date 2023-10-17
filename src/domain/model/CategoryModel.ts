/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { ExamCategory } from './ExamCategoryModel';
import { UserCategory } from './UserCategoryModel';

/**
 * define model
 */
export class Category extends Sequelize.Model {
  public static ASSOCIATE() {
    Category.hasMany(UserCategory);
    Category.hasMany(ExamCategory);
  }
  public readonly id: number;
  public name: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
  public userCategory?: UserCategory;
  public examCategory?: ExamCategory;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      name: {
        allowNull: false,
        type: dt.TEXT
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'category',
      paranoid: true,
      name: { singular: 'category', plural: 'category' }
    }
  );

  return Category;
};
