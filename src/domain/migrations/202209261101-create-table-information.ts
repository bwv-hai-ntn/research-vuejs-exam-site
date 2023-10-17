import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('information', {
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
        description: {
          allowNull: false,
          type: dt.TEXT
        },
        mandatory: {
          allowNull: false,
          type: dt.BOOLEAN
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

      await changeCharset(qi, 'information');
    } catch (err) {
      throw err;
    }
  }
};
