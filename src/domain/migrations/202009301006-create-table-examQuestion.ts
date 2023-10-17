/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('examQuestion', {
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
          type: dt.TEXT
        },
        audioPath: {
          type: dt.TEXT
        },
        answerType: {
          type: dt.TINYINT.UNSIGNED
        },
        rightAnswerByText: {
          type: dt.TEXT
        },
        points: {
          type: dt.INTEGER.UNSIGNED
        },
        sort: {
          type: dt.INTEGER.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'examQuestion');
    } catch (err) {
      throw err;
    }
  }
};
