import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dt: typeof DataTypes) => {
    try {
      await qi.addColumn('pickup', 'imagePath', {
        type: dt.STRING(256),
        allowNull: true
      });
    } catch (err) {
      throw err;
    }
  }
};
