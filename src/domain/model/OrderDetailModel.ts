/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { literal } from 'sequelize';
import { Orders } from './OrdersModel';
import { Products } from './ProductsModel';

/**
 * define model
 */
export class OrderDetail extends Sequelize.Model {
  public static ASSOCIATE() {
    //Orders
    OrderDetail.belongsTo(Orders, {
      foreignKey: 'orderId'
    });
    //Products
    OrderDetail.belongsTo(Products, {
      foreignKey: 'productId'
    });
  }
  public readonly id: number;
  public orderId: number;
  public productId: number;
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
  OrderDetail.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      orderId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED,
        field: 'order_id'
      },
      productId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED,
        field: 'product_id'
      },
      quantity: {
        type: dt.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      total: {
        type: dt.DECIMAL,
        defaultValue: 0
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
      tableName: 'orderDetail',
      paranoid: true,
      name: { singular: 'orderDetail', plural: 'orderDetail' }
    }
  );

  return OrderDetail;
};
