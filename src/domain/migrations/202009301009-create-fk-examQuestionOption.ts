import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const examQuestionOptionExamQuestionFK = qi.addConstraint(
      'examQuestionOption',
      ['examQuestionId'],
      {
        name: 'examQuestionOptionExamQuestionFK',
        type: 'foreign key',
        references: {
          table: 'examQuestion',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    return Promise.all([examQuestionOptionExamQuestionFK]);
  }
};
