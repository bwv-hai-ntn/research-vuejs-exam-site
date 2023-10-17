/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('exam', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        title: {
          allowNull: false,
          type: dt.TEXT
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
          type: dt.TEXT
        },
        limitResponse: {
          type: dt.TINYINT.UNSIGNED
        },
        testTime: {
          type: dt.DECIMAL(2, 1)
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
        accessURL: {
          type: dt.TEXT
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'exam');
    } catch (err) {
      throw err;
    }
  }
};
