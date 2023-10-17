/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { commonFields } from '../_common';
import { Answer } from './AnswerModel';
import { ExamCategory } from './ExamCategoryModel';
import { ExamSection } from './ExamSectionModel';

/**
 * define model
 */
export class Exam extends Sequelize.Model {
  public static ASSOCIATE() {
    Exam.hasMany(ExamCategory);
    Exam.hasMany(ExamSection);
    Exam.hasMany(Answer);
  }
  public readonly id: number;
  public title: string;
  public description?: string;
  public acceptAnswer?: number;
  public signinRestrict?: number;
  public userRestrict?: string;
  public limitResponse?: number;
  public testTimeSetting?: number;
  public testTime?: number;
  public totalPoints?: number;
  public passPercentage?: number;
  public showResult?: number;
  public shuffleQuestion?: number;
  public shuffleOption?: number;
  public endMessage?: string;
  public accessKey?: string;
  public imagePath?: string;
  public accessURL?: string;
  public resultValidity?: number;
  public examCategory?: ExamCategory[];
  public examSection: ExamSection[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Exam.init(
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
        type: dt.TEXT
      },
      acceptAnswer: {
        type: dt.TINYINT.UNSIGNED
      },
      signinRestrict: {
        type: dt.TINYINT.UNSIGNED
      },
      userRestrict: {
        type: dt.STRING(256)
      },
      limitResponse: {
        type: dt.TINYINT.UNSIGNED
      },
      testTimeSetting: {
        type: dt.TINYINT.UNSIGNED
      },
      testTime: {
        type: dt.INTEGER.UNSIGNED
      },
      totalPoints: {
        type: dt.INTEGER.UNSIGNED
      },
      passPercentage: {
        type: dt.INTEGER.UNSIGNED
      },
      showResult: {
        type: dt.TINYINT.UNSIGNED
      },
      shuffleQuestion: {
        type: dt.TINYINT.UNSIGNED
      },
      shuffleOption: {
        type: dt.TINYINT.UNSIGNED
      },
      endMessage: {
        type: dt.TEXT
      },
      accessKey: {
        type: dt.TEXT
      },
      imagePath: {
        type: dt.STRING(256)
      },
      resultValidity: {
        type: dt.INTEGER
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'exam',
      paranoid: true,
      name: { singular: 'exam', plural: 'exam' }
    }
  );

  return Exam;
};
