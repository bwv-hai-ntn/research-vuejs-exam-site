import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    return Promise.all([
      qi.sequelize.query(
        'ALTER TABLE `exam` ADD COLUMN `testTimeSetting` TINYINT UNSIGNED AFTER `limitResponse`'
      ),
      qi.sequelize.query(
        'ALTER TABLE `examSection` ADD COLUMN `testTime` INT UNSIGNED AFTER `description`'
      )
    ]);
  }
};
