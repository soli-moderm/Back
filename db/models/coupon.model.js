const { Model, DataTypes, Sequelize } = require('sequelize');

const COUPON_TABLE = 'coupons';

const CouponSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  discount: {
    allowNull: false,
    type: DataTypes.FLOAT,
    field: 'discount',
  },
  usageLimit:{
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'usage_limit',
  },
  timesUsed: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'times_used',
  },
  startDate: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'start_date',
  },
  endDate: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'end_date',
  },
  minimumPurchase: {
    type: DataTypes.FLOAT,
    field: 'minimum_purchase',
    allowNull: true,
  },
  maximumDiscount: {
    type: DataTypes.FLOAT,
    field: 'maximumDiscount',
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class Coupon extends Model {
  static associate(models) {
    //un cupon puede estar en varias ordenes
    this.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'couponId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COUPON_TABLE,
      modelName: 'Coupon',
      timestamps: false,
    };
  }
}

module.exports = { Coupon, CouponSchema, COUPON_TABLE };
