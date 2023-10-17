/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';

/**
 * define model
 */
export class ExamQuestionOption extends Sequelize.Model {
  public static ASSOCIATE() {
    //
  }
  public readonly id: number;
  public examQuestionId: number;
  public content?: string;
  public rightAnswer?: number;
  public sort?: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  ExamQuestionOption.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      examQuestionId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      content: {
        type: dt.STRING(256)
      },
      rightAnswer: {
        type: dt.TINYINT.UNSIGNED
      },
      sort: {
        type: dt.INTEGER.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'examQuestionOption',
      paranoid: true,
      name: { singular: 'examQuestionOption', plural: 'examQuestionOption' }
    }
  );

  return ExamQuestionOption;
};
