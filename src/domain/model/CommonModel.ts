/**
 * COMOM Model
 */
import { DataTypes, literal } from 'sequelize';

export const commonFields = (dt: typeof DataTypes) => ({
  createdAt: {
    allowNull: false,
    field: 'created_at',
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  created_by: {
    allowNull: false,
    type: dt.BIGINT.UNSIGNED
  },
  // created_user_name: {
  //   allowNull: false,
  //   type: dt.STRING(30)
  // },
  updatedAt: {
    allowNull: false,
    field: 'updated_at',
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updated_by: {
    allowNull: false,
    type: dt.BIGINT.UNSIGNED
  },
  // updated_user_name: {
  //   allowNull: false,
  //   type: dt.STRING(30)
  // },
  deletedAt: {
    type: dt.DATE,
    field: 'deleted_at'
  },
  deleted_by: {
    type: dt.BIGINT.UNSIGNED
  }
  // deleted_user_name: {
  //   type: dt.STRING(30)
  // }
});
