import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    const examanswerIdFK = qi.addConstraint('answer', ['examId'], {
      name: 'examanswerIdFK',
      type: 'foreign key',
      references: {
        table: 'exam',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    return Promise.all([examanswerIdFK]);
  }
};
