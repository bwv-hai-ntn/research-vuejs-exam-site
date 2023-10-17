/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('userCategory', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        userId: {
          allowNull: false,
          type: dt.BIGINT.UNSIGNED
        },
        categoryId: {
          allowNull: false,
          type: dt.BIGINT.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'userCategory');
    } catch (err) {
      throw err;
    }
  }
};
