import { FindOptions, Op, Sequelize } from 'sequelize';
import { DB } from '../model';
import { types } from './../../constant';
import BaseRepository from './BaseRepo';
import * as _ from 'lodash';

export default class ProductsRepository extends BaseRepository {
  public readonly model: DB['Products'];
  constructor(db: DB) {
    super(db);
    this.model = db.Products;
  }

  public async searchProducts(params: types.products.searchListProducts) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    const { rows, count } = await this.model.findAndCountAll(findOption);
    let countValue;
    if (Array.isArray(count)) {
      countValue = count.length;
    } else {
      countValue = count;
    }

    return { rows, count: countValue };
  }

  private makeFindOption(params: types.products.searchListProducts) {
    const findOption: FindOptions = {
      include: [
        {
          model: this.db.OrderDetail,
          attributes: [],
          required: false,
          include: [
            {
              model: this.db.Orders,
              attributes: [],
              required: false
            }
          ]
        }
      ],
      attributes: [
        'id',
        'name',
        'price',
        'imagePath',
        'featuredFlg',
        [
          Sequelize.fn(
            'IFNULL',
            Sequelize.fn('SUM', Sequelize.col('orderDetail.quantity')),
            0
          ),
          'totalQuantityOrder'
        ],
        [
          Sequelize.fn(
            'IFNULL',
            Sequelize.fn('COUNT', Sequelize.col('orderDetail.id')),
            0
          ),
          'orderCount'
        ]
      ],
      group: ['products.id'],
      subQuery: false
    };

    if (!params) {
      return findOption;
    }
    if (params.productName) {
      findOption.where = {
        ...findOption.where,
        name: {
          [Op.substring]: params.productName
        }
      };
    }
    if (params.featuredFlg) {
      findOption.where = {
        ...findOption.where,
        featuredFlg: {
          [Op.in]: params.featuredFlg
        }
      };
    }
    const where = [];
    if (params.priceFrom) {
      where.push({
        price: {
          [Op.gte]: params.priceFrom
        }
      });
    }
    if (params.priceTo) {
      where.push({
        price: {
          [Op.lte]: params.priceTo
        }
      });
    }
    if (params.createdDateFrom) {
      where.push({
        createdAt: {
          [Op.gte]: params.createdDateFrom
        }
      });
    }
    if (params.createdDateTo) {
      where.push({
        createdAt: {
          [Op.lte]: params.createdDateTo
        }
      });
    }

    if (where.length > 0) {
      findOption.where = {
        ...findOption.where,
        [Op.and]: where
      };
    }

    return findOption;
  }

  public async deleteProduct(id: number | string) {
    await this.model.destroy({
      where: {
        id
      }
    });
    return { status: 'ok' };
  }

  public async saveProduct(data: any[]) {
    const transaction = await this.db.sequelize.transaction();
    try {
      if (data.length > 0) {
        await this.db.Products.bulkCreate(data, {
          transaction,
          updateOnDuplicate: [
            'name',
            'price',
            'content',
            'featured_flg',
            'updated_at'
          ]
        });
      }
      transaction.commit();
    } catch (error) {
      transaction.rollback();
    }
  }

  public async findById(id: string | number) {
    return this.model.findOne({ where: { id } });
  }
}
