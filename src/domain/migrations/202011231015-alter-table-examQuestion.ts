import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('examQuestion', 'picturePath', {
        type: dataTypes.STRING(2000)
      }),
      qi.changeColumn('examQuestion', 'audioPath', {
        type: dataTypes.STRING(2000)
      }),
      qi.changeColumn('examQuestion', 'rightAnswerByText', {
        type: dataTypes.STRING(400)
      })
    ]);
  }
};
