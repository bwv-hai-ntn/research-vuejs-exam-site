import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    qi.sequelize.query(
      'ALTER TABLE `exam` ADD COLUMN `resultValidity` INT AFTER `showResult`'
    );
  }
};
