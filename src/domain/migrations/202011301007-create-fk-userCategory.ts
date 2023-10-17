import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const userCategoryUserFK = qi.addConstraint('userCategory', ['userId'], {
      name: 'userCategoryUserFK',
      type: 'foreign key',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    const userCategoryCategoryFK = qi.addConstraint(
      'userCategory',
      ['categoryId'],
      {
        name: 'userCategoryCategoryFK',
        type: 'foreign key',
        references: {
          table: 'category',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    return Promise.all([userCategoryUserFK, userCategoryCategoryFK]);
  }
};
