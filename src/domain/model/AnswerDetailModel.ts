/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';

/**
 * define model
 */
export class AnswerDetail extends Sequelize.Model {
  public static ASSOCIATE() {
    //
  }
  public readonly id: number;
  public answerId: number;
  public examQuestionId?: number;
  public examQuestionOptionId?: string;
  public answerByText?: string;
  public score?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  AnswerDetail.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      answerId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      examQuestionId: {
        type: dt.BIGINT.UNSIGNED
      },
      examQuestionOptionId: {
        type: dt.STRING(256)
      },
      answerByText: {
        type: dt.STRING(400)
      },
      score: {
        type: dt.INTEGER.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'answerDetail',
      paranoid: true,
      name: { singular: 'answerDetail', plural: 'answerDetail' }
    }
  );

  return AnswerDetail;
};
