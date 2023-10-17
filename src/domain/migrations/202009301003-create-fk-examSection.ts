import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const examExamSectionIdFK = qi.addConstraint('examSection', ['examId'], {
      name: 'examExamSectionIdFK',
      type: 'foreign key',
      references: {
        table: 'exam',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    return Promise.all([examExamSectionIdFK]);
  }
};
