import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) =>
    qi.changeColumn('exam', 'resultValidity', {
      type: dt.INTEGER.UNSIGNED,
      allowNull: true
    })
};
