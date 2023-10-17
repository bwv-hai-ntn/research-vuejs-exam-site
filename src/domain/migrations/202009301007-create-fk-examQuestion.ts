import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const examQuestioneEamSectionFK = qi.addConstraint(
      'examQuestion',
      ['examSectionId'],
      {
        name: 'examQuestioneEamSectionFK',
        type: 'foreign key',
        references: {
          table: 'examSection',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    const higherExamQuestionFK = qi.addConstraint(
      'examQuestion',
      ['higherExamQuestionId'],
      {
        name: 'higherExamQuestionFK',
        type: 'foreign key',
        references: {
          table: 'examQuestion',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    return Promise.all([examQuestioneEamSectionFK, higherExamQuestionFK]);
  }
};
