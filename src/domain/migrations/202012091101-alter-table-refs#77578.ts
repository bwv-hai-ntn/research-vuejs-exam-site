import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      await qi.changeColumn('answer', 'scorePercentage', {
        type: dataTypes.DECIMAL(10, 2)
      }),
      // remove FK
      await qi.removeConstraint('answerDetail', 'answerDetailExamQuestionFK'),
      await qi.changeColumn('answerDetail', 'examQuestionId', {
        allowNull: false,
        type: dataTypes.BIGINT.UNSIGNED
      }),
      // re create FK
      await qi.addConstraint('answerDetail', ['examQuestionId'], {
        name: 're_answerDetailExamQuestionFK',
        type: 'foreign key',
        references: {
          table: 'examQuestion',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      }),

      await qi.changeColumn('category', 'name', {
        allowNull: false,
        type: dataTypes.STRING(100)
      }),
      await qi.changeColumn('exam', 'testTime', {
        type: dataTypes.INTEGER.UNSIGNED
      }),
      await qi.changeColumn('user', 'userName', {
        allowNull: false,
        type: dataTypes.STRING(100)
      }),
      await qi.changeColumn('user', 'email', {
        allowNull: false,
        type: dataTypes.STRING(256)
      })
    ]);
  }
};
