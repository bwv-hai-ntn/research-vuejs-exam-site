import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('pickup', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        title: {
          allowNull: false,
          type: dt.STRING(100)
        },
        note: {
          type: dt.STRING(200)
        },
        pageDescription: {
          type: dt.TEXT
        },
        sort: {
          allowNull: false,
          type: dt.INTEGER.UNSIGNED
        },
        displayTop: {
          allowNull: false,
          type: dt.BOOLEAN
        },
        postPeriodFrom: {
          type: dt.DATE
        },
        postPeriodTo: {
          type: dt.DATE
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'pickup');
    } catch (err) {
      throw err;
    }
  }
};
