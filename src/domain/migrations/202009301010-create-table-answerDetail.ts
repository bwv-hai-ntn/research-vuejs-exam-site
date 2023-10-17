/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('answerDetail', {
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
          type: dt.TEXT
        },
        score: {
          type: dt.INTEGER.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'answerDetail');
    } catch (err) {
      throw err;
    }
  }
};
