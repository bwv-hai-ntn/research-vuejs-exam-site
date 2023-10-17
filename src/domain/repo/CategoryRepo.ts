import { FindOptions, IncludeOptions, Op } from 'sequelize';
import { Static } from '../../constant/index';
import { DB } from '../model';
import BaseRepository from './BaseRepo';

export default class ExamQuestionOptionRepository extends BaseRepository {
  public readonly model: DB['Category'];
  constructor(db: DB) {
    super(db);
    this.model = db.Category;
  }

  public async getCategory(
    userId: number | string,
    authority: number | string,
    categoryName?: string
  ) {
    const findOption = this.makeFindOption(userId, authority, categoryName);
    const categories = await this.model.findAll(findOption);
    const category = [];
    for (const item of categories) {
      category.push({
        id: item.id,
        name: item.name,
        isUpdate: false
      });
    }
    return category;
  }

  public async saveDataCatagory(
    categoryId: string | number,
    categoryName: string
  ) {
    try {
      // check isExist category
      if (categoryName !== undefined) {
        const category = await this.model.findOne({
          where: {
            name: categoryName
          }
        });
        if (category !== null) {
          return { status: 'isExist' };
        }
      }
      // add category
      if (categoryId !== undefined && categoryId === 0) {
        const category = await this.model.create({
          id: categoryId,
          name: categoryName
        });
        return { status: 'ok', id: category.id };
      }
      // update category
      if (categoryId !== undefined && categoryId !== 0) {
        await this.model.update(
          {
            name: categoryName
          },
          {
            where: {
              id: categoryId
            }
          }
        );
        return { status: 'ok' };
      }
      return { status: 'failed' };
    } catch (err) {
      return { status: 'failed' };
    }
  }

  public async deleteCategory(categoryId: number | string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      if (categoryId !== undefined) {
        // delete catagory
        await this.model.destroy({
          where: {
            id: categoryId
          },
          transaction
        });
        // delete exam catagory
        await this.db.ExamCategory.destroy({
          where: {
            categoryId
          },
          transaction
        });
        // delete user catagory
        await this.db.UserCategory.destroy({
          where: {
            categoryId
          },
          transaction
        });
        await transaction.commit();
        return { status: 'ok' };
      }
      await transaction.rollback();
      return { status: 'failed' };
    } catch (err) {
      await transaction.rollback();
      return { status: 'failed' };
    }
  }

  public async getCategoryUser() {
    const list = await this.model.findAll();
    return list;
  }

  private makeFindOption(
    userId: number | string,
    authority: number | string,
    categoryName?: string
  ) {
    if (authority === Static.authority.ADMIN) {
      if (categoryName !== undefined && categoryName !== '') {
        const findOptionAdmin: FindOptions = {
          where: {
            name: { [Op.like]: `%${categoryName}%` }
          }
        };
        findOptionAdmin.order = [['id', 'ASC']];
        return findOptionAdmin;
      }
      return {};
    }
    const categoryInludeOption: IncludeOptions = {
      model: this.db.UserCategory,
      required: true,
      where: {
        userId
      }
    };
    const findOption: FindOptions = {
      include: [categoryInludeOption]
    };
    if (categoryName !== undefined) {
      findOption.where = {
        ...findOption.where,
        name: { [Op.like]: `%${categoryName}%` }
      };
    }
    findOption.order = [['id', 'ASC']];
    return findOption;
  }
}
