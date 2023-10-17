import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const answerDetailAnswerFK = qi.addConstraint(
      'answerDetail',
      ['answerId'],
      {
        name: 'answerDetailAnswerFK',
        type: 'foreign key',
        references: {
          table: 'answer',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    const answerDetailExamQuestionFK = qi.addConstraint(
      'answerDetail',
      ['examQuestionId'],
      {
        name: 'answerDetailExamQuestionFK',
        type: 'foreign key',
        references: {
          table: 'examQuestion',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }
    );

    return Promise.all([answerDetailAnswerFK, answerDetailExamQuestionFK]);
  }
};
