/**
 * //
 */
import * as lodash from 'lodash';
import { FindOptions, IncludeOptions, literal, Op } from 'sequelize';
import { DB } from '../model';
import { Static, types } from './../../constant';
import BaseRepository from './BaseRepo';

export default class UserRepository extends BaseRepository {
  public readonly model: DB['User'];
  constructor(db: DB) {
    super(db);
    this.model = db.User;
  }

  public async searchUser(email: string) {
    const user = await this.model.findAll({
      where: {
        email,
        authority: {
          [Op.in]: [Static.authority.ADMIN, Static.authority.AUTHOR]
        }
      }
    });

    return user;
  }

  public async searchListUser(params: types.user.searchListUser) {
    const idFindOption = this.makeOption(params, true);
    const idUsers = await this.model.findAll(idFindOption);
    const findOption = this.makeOption(params);
    findOption.where = {
      ...findOption.where,
      id: lodash.map(idUsers, 'id')
    };
    const listUser = await this.model.findAll(findOption);
    for (const user of listUser) {
      const arrUserCategories = [];
      if (user.authority === Static.authority.ADMIN) {
        arrUserCategories.push(Static.usercategoriesScreen.Admin);
      } else {
        for (const userCategory of user.userCategory!) {
          if (userCategory.category) {
            arrUserCategories.push(userCategory.category!.name);
          }
        }
      }
      (<any>user).setDataValue(
        'arrUserCategories',
        arrUserCategories.join(', ')
      );
    }
    return {
      rows: listUser,
      count: idUsers.length
    };
  }

  public async createUpdateUser(params: types.user.createUser) {
    if (params.id) {
      const user = await this.model.findOne({
        where: {
          id: params.id
        }
      });
      await user!.update({
        userName: params.userNameEdit,
        email: params.emailEdit,
        authority: params.authorityEdit,
        updatedAt: Date.now()
      });
    } else {
      await this.model.create({
        userName: params.userNameEdit,
        email: params.emailEdit,
        authority: params.authorityEdit,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }

  public async deleteUser(id: number | string) {
    const transaction = await this.db.sequelize.transaction();
    try {
      await this.model.update(
        {
          deletedAt: new Date()
        },
        {
          where: {
            id
          },
          silent: true,
          transaction
        }
      );
      await this.db.UserCategory.update(
        {
          deletedAt: new Date()
        },
        {
          where: {
            userId: id
          },
          silent: true,
          transaction
        }
      );
      transaction.commit();
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  public async checkUser(email: string, id?: number | string) {
    const findOption: FindOptions = {
      where: {
        email
      }
    };
    if (id) {
      findOption.where = {
        ...findOption.where,
        id: {
          [Op.ne]: id
        }
      };
    }
    const user = await this.model.findOne(findOption);
    return user ? false : true;
  }

  public async createUpdateCategory(params: types.user.saveUserCategory) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const userCategories = await this.db.UserCategory.findAll({
        where: {
          userId: params.userId
        },
        attributes: ['id', 'categoryId']
      });
      for (const userCategory of userCategories) {
        if (params.cbxCategory.indexOf(userCategory.categoryId) < 0) {
          await this.db.UserCategory.update(
            {
              deletedAt: new Date()
            },
            {
              where: {
                id: userCategory.id
              },
              silent: true,
              transaction
            }
          );
        }
      }
      for (const cbxId of params.cbxCategory) {
        const findCatagoryId = userCategories.find(
          (userCategory) => userCategory.categoryId === Number(cbxId)
        );
        if (!findCatagoryId) {
          await this.db.UserCategory.create(
            {
              userId: params.userId,
              categoryId: cbxId,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              transaction
            }
          );
        }
      }
      transaction.commit();
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }

  private makeOption(params: types.user.searchListUser, conditions?: boolean) {
    const categoryIncludeOption: IncludeOptions = {
      model: this.db.Category,
      attributes: ['id', 'name']
    };
    const userCategoryIncludeOption: IncludeOptions = {
      attributes: ['id'],
      model: this.db.UserCategory
    };
    const findOption: FindOptions = {
      order: [['id', 'ASC']],
      subQuery: false
    };
    if (params && conditions) {
      if (params.userName && params.userName !== '') {
        findOption.where = {
          ...findOption.where,
          userName: {
            [Op.substring]: params.userName
          }
        };
      }
      if (params.email && params.email !== '') {
        findOption.where = {
          ...findOption.where,
          email: {
            [Op.substring]: params.email
          }
        };
      }
      if (params.authority && params.authority !== '') {
        findOption.where = {
          ...findOption.where,
          authority: {
            [Op.in]: params.authority
          }
        };
      }
      if (params.category && params.category !== '') {
        const whereLiteral = `CASE User.\`authority\`
        WHEN ${Static.authority.ADMIN}
        THEN 1 = 1
        ELSE \`userCategory->category\`.\`id\` = :id END`;
        findOption.replacements = {
          id: params.category
        };
        findOption.where = {
          ...findOption.where,
          where: literal(whereLiteral)
        };
      }
    }
    userCategoryIncludeOption.include = [categoryIncludeOption];
    findOption.include = [userCategoryIncludeOption];
    return findOption;
  }
}
