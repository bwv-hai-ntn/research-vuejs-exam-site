/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('answer', {
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
          type: dt.TEXT
        },
        email: {
          type: dt.TEXT
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
        ...commonFields(dt)
      });

      await changeCharset(qi, 'answer');
    } catch (err) {
      throw err;
    }
  }
};
