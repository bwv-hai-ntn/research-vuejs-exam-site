import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const examCategoryExamFK = qi.addConstraint('examCategory', ['examId'], {
      name: 'examCategoryExamFK',
      type: 'foreign key',
      references: {
        table: 'exam',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    const examCategoryCategoryFK = qi.addConstraint(
      'examCategory',
      ['categoryId'],
      {
        name: 'examCategoryCategoryFK',
        type: 'foreign key',
        references: {
          table: 'category',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    return Promise.all([examCategoryExamFK, examCategoryCategoryFK]);
  }
};
