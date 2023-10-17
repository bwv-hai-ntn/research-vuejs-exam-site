/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('examQuestionOption', {
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
          type: dt.TEXT
        },
        rightAnswer: {
          type: dt.TINYINT.UNSIGNED
        },
        sort: {
          type: dt.INTEGER.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'examQuestionOption');
    } catch (err) {
      throw err;
    }
  }
};
