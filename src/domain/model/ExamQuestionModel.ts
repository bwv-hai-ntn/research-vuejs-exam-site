/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { AnswerDetail } from './AnswerDetailModel';
import { ExamQuestionOption } from './ExamQuestionOptionModel';
import { ExamSection } from './ExamSectionModel';

/**
 * define model
 */
export class ExamQuestion extends Sequelize.Model {
  public static ASSOCIATE() {
    this.hasMany(ExamQuestionOption);
    this.hasOne(AnswerDetail);
    this.belongsTo(ExamSection);
  }
  public readonly id: number;
  public examSectionId: number;
  public higherExamQuestionId?: number;
  public content?: string;
  public picturePath?: string;
  public audioPath?: string;
  public answerType?: number;
  public rightAnswerByText?: string;
  public points?: number;
  public explanation?: string;
  public sort?: number;
  public questionChild?: ExamQuestion[];
  public examQuestionOption?: ExamQuestionOption[];
  public answerDetail?: AnswerDetail;
  public questionOptions?: ExamQuestionOption[];
  public questions?: ExamQuestion[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  ExamQuestion.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      examSectionId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      higherExamQuestionId: {
        type: dt.BIGINT.UNSIGNED
      },
      content: {
        type: dt.TEXT
      },
      picturePath: {
        type: dt.STRING(2000)
      },
      audioPath: {
        type: dt.STRING(2000)
      },
      answerType: {
        type: dt.TINYINT.UNSIGNED
      },
      rightAnswerByText: {
        type: dt.STRING(400)
      },
      points: {
        type: dt.INTEGER.UNSIGNED
      },
      explanation: {
        type: dt.TEXT
      },
      sort: {
        type: dt.INTEGER.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'examQuestion',
      paranoid: true,
      name: { singular: 'examQuestion', plural: 'examQuestion' }
    }
  );

  return ExamQuestion;
};
