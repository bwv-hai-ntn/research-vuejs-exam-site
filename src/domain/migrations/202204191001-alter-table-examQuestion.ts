import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, _: typeof DataTypes) => {
    return Promise.all([
      qi.sequelize.query(
        'ALTER TABLE examQuestion ADD COLUMN explanation TEXT AFTER points;'
      )
    ]);
  }
};
