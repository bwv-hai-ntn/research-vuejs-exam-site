/**
 * //
 */
import { DataTypes, literal, QueryInterface } from 'sequelize';

export const commonFields = (dt: typeof DataTypes) => ({
  createdAt: {
    allowNull: false,
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    allowNull: false,
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  deletedAt: {
    type: dt.DATE
  }
});

export const changeCharset = (qi: QueryInterface, tableName: string) =>
  qi.sequelize.query(
    `ALTER TABLE ${tableName} CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci`
  );
