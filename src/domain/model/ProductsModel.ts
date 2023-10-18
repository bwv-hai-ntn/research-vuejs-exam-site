/**
 * Model
 */
import * as Sequelize from 'sequelize';
import { literal } from 'sequelize';
import { OrderDetail } from './OrderDetailModel';
import { Exclude } from 'class-transformer';

/**
 * define model
 */
export class Products extends Sequelize.Model {
  public static ASSOCIATE() {
    //
    Products.hasMany(OrderDetail, {
      foreignKey: 'productId'
    })
  }
  public readonly id: number;
  public name: string;
  public price: number;
  public content: string;
  public imagePath?: string;
  public featuredFlg: number;
  public viewed?: number;
  public ordered?: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt?: Date;

  public readonly createdBy?: number;
  public readonly updatedBy?: number;
  public readonly deletedBy?: number;

  @Exclude({ toClassOnly: true })
  priceFrom: number;
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Products.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED,
      },
      name: {
        allowNull: false,
        type: dt.STRING(100)
      },
      price: {
        allowNull: false,
        type: dt.DECIMAL
      },
      content: {
        allowNull: false,
        type: dt.TEXT
      },
      imagePath: {
        type: dt.STRING(50),
        field: 'image_path'
      },
      featuredFlg: {
        allowNull: false,
        type: dt.TINYINT.UNSIGNED,
        field: 'featured_flg'
      },
      viewed: {
        type: dt.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      ordered: {
        type: dt.INTEGER.UNSIGNED,
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
      tableName: 'products',
      paranoid: true,
      name: { singular: 'products', plural: 'products' }
    }
  );

  return Products;
};
