/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Exam } from './ExamModel';
import { ExamQuestion } from './ExamQuestionModel';

/**
 * define model
 */
export class ExamSection extends Sequelize.Model {
  public static ASSOCIATE() {
    this.hasMany(ExamQuestion);
    this.belongsTo(Exam);
  }
  public readonly id: number;
  public examId: number;
  public title?: string;
  public description?: string;
  public testTime?: number;
  public sort?: number;
  public examQuestions?: ExamQuestion[];
  public examQuestionsPopup?: ExamQuestion[];
  public examQuestion?: ExamQuestion[];
  public questions: ExamQuestion[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  ExamSection.init(
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
      title: {
        type: dt.STRING(100)
      },
      description: {
        type: dt.TEXT
      },
      testTime: {
        type: dt.INTEGER.UNSIGNED
      },
      sort: {
        type: dt.INTEGER.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'examSection',
      paranoid: true,
      name: { singular: 'examSection', plural: 'examSection' }
    }
  );

  return ExamSection;
};
