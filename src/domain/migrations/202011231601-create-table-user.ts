/**
 * //
 */
import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('user', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        userName: {
          allowNull: false,
          type: dt.TEXT
        },
        email: {
          allowNull: false,
          type: dt.TEXT
        },
        authority: {
          allowNull: false,
          type: dt.INTEGER.UNSIGNED
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'user');
    } catch (err) {
      throw err;
    }
  }
};
