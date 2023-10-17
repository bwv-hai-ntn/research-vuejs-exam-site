import { DataTypes, QueryInterface } from 'sequelize';
import { changeCharset, commonFields } from '../_common';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.createTable('pickupDetail', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: dt.BIGINT.UNSIGNED
        },
        pickupId: {
          allowNull: false,
          type: dt.BIGINT.UNSIGNED
        },
        examId: {
          allowNull: false,
          type: dt.BIGINT.UNSIGNED
        },
        title: {
          type: dt.STRING(200)
        },
        note: {
          type: dt.STRING(200)
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

      await changeCharset(qi, 'pickupDetail');

      const pickupDetailPickupFK = qi.addConstraint(
        'pickupDetail',
        ['pickupId'],
        {
          name: 'pickupDetailPickupFK',
          type: 'foreign key',
          references: {
            table: 'pickup',
            field: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        }
      );

      const pickupDetailExamFK = qi.addConstraint('pickupDetail', ['examId'], {
        name: 'pickupDetailExamFK',
        type: 'foreign key',
        references: {
          table: 'exam',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });

      return Promise.all([pickupDetailPickupFK, pickupDetailExamFK]);
    } catch (err) {
      throw err;
    }
  }
};
