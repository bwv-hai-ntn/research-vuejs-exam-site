/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('category', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        name: {
          allowNull: false,
          type: dt.TEXT
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'category');
    } catch (err) {
      throw err;
    }
  }
};
