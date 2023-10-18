/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { literal } from 'sequelize';
import { OrderDetail } from './OrderDetailModel';

/**
 * define model
 */
export class Orders extends Sequelize.Model {
  public static ASSOCIATE() {
    //
    Orders.hasMany(OrderDetail, {
      foreignKey: 'orderId'
    });
  }
  public readonly id: number;
  public quantity: number;
  public total: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  public readonly createdBy?: number;
  public readonly updatedBy?: number;
  public readonly deletedBy?: number;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
    Orders.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED,
      },
      quantity: {
        type: dt.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      total: {
        allowNull: false,
        type: dt.DECIMAL
      },
      createdBy: {
        type: dt.BIGINT.UNSIGNED,
        field: 'created_by'
      },
      updatedBy: {
        type: dt.BIGINT.UNSIGNED,
        field: 'updated_by'
      },
      deletedBy: {
        type: dt.BIGINT.UNSIGNED,
        field: 'deleted_by'
      },
      createdAt: {
        allowNull: false,
        type: dt.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: dt.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
      },
      deletedAt: {
        type: dt.DATE,
        field: 'deleted_at'
      }
    },
    {
      sequelize,
      tableName: 'orders',
      paranoid: true,
      name: { singular: 'orders', plural: 'orders' }
    }
  );

  return Orders;
};
