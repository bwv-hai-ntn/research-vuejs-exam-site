/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('examSection', {
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
          type: dt.TEXT
        },
        description: {
          type: dt.TEXT
        },
        sort: {
          type: dt.INTEGER.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'examSection');
    } catch (err) {
      throw err;
    }
  }
};
