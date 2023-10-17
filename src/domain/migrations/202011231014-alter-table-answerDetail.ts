import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('answerDetail', 'answerByText', {
        type: dataTypes.STRING(400)
      })
    ]);
  }
};
