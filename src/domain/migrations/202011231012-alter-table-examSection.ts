import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('examSection', 'title', {
        type: dataTypes.STRING(100)
      })
    ]);
  }
};
