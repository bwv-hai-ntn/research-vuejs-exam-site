import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('recommendation', {
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
        imagePath: {
          type: dt.STRING(256)
        },
        redirectUrl: {
          type: dt.STRING(256)
        },
        sort: {
          allowNull: false,
          type: dt.INTEGER.UNSIGNED
        },
        postPeriodFrom: {
          type: dt.DATE
        },
        postPeriodTo: {
          type: dt.DATE
        },
        ...commonFields(dt)
      });

      await changeCharset(qi, 'recommendation');
    } catch (err) {
      throw err;
    }
  }
};
