/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Category } from './CategoryModel';
import { Exam } from './ExamModel';

/**
 * define model
 */
export class ExamCategory extends Sequelize.Model {
  public static ASSOCIATE() {
    ExamCategory.belongsTo(Category);
    ExamCategory.belongsTo(Exam);
  }
  public readonly id: number;
  public examId: number;
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
  ExamCategory.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      examId: {
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
      tableName: 'examCategory',
      paranoid: true,
      name: { singular: 'examCategory', plural: 'examCategory' }
    }
  );

  return ExamCategory;
};
