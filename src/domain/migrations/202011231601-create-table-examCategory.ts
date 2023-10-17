/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('examCategory', {
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
        categoryId: {
          allowNull: false,
          type: dt.BIGINT.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'examCategory');
    } catch (err) {
      throw err;
    }
  }
};
