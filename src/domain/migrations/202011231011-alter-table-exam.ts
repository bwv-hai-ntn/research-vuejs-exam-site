import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('exam', 'title', {
        allowNull: false,
        type: dataTypes.STRING(100)
      }),
      qi.changeColumn('exam', 'userRestrict', {
        type: dataTypes.STRING(256)
      }),
      qi.changeColumn('exam', 'accessKey', {
        type: dataTypes.STRING(100)
      }),
      qi.removeColumn('exam', 'accessURL')
    ]);
  }
};
