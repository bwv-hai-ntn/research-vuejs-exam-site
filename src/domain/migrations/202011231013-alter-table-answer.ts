import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('answer', 'name', {
        allowNull: false,
        type: dataTypes.STRING(100)
      }),
      qi.changeColumn('answer', 'email', {
        type: dataTypes.STRING(256)
      })
    ]);
  }
};
