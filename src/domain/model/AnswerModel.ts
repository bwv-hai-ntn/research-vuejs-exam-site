/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Exam } from './ExamModel';

/**
 * define model
 */
export class Answer extends Sequelize.Model {
  public static ASSOCIATE() {
    Answer.belongsTo(Exam);
  }
  public readonly id: number;
  public examId: number;
  public name: string;
  public email?: string;
  public completedTest?: number;
  public totalScore?: number;
  public scorePercentage?: string;
  public passExam?: number;
  public exam?: Exam;
  public expiredAt?: Date;
  public accessToken?: string;
  public sendResultViaEmail?: number;
  public country?: number;
  public completedAt?: Date;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Answer.init(
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
      name: {
        allowNull: false,
        type: dt.STRING(100)
      },
      email: {
        type: dt.STRING(256)
      },
      completedTest: {
        type: dt.TINYINT.UNSIGNED
      },
      totalScore: {
        type: dt.INTEGER.UNSIGNED
      },
      scorePercentage: {
        type: dt.STRING(20)
      },
      passExam: {
        type: dt.TINYINT.UNSIGNED
      },
      accessToken: {
        type: dt.STRING(32)
      },
      expiredAt: {
        type: dt.DATE
      },
      sendResultViaEmail: {
        type: dt.TINYINT.UNSIGNED
      },
      country: {
        type: dt.TINYINT.UNSIGNED
      },
      completedAt: {
        type: dt.DATE
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'answer',
      paranoid: true,
      name: { singular: 'answer', plural: 'answer' }
    }
  );

  return Answer;
};
