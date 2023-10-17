import { QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    await qi.sequelize.query(
      'ALTER TABLE answer ADD COLUMN country TinyInt unsigned AFTER email'
    );
    await qi.sequelize.query(
      'ALTER TABLE answer ADD COLUMN completedAt datetime AFTER completedTest'
    );
    await qi.sequelize.query(
      'ALTER TABLE answer ADD COLUMN accessToken VARCHAR(100) AFTER passExam'
    );
    await qi.sequelize.query(
      'ALTER TABLE answer ADD COLUMN expiredAt datetime AFTER accessToken'
    );
    await qi.sequelize.query(
      'ALTER TABLE answer ADD COLUMN sendResultViaEmail TinyInt unsigned AFTER expiredAt'
    );
  }
};
