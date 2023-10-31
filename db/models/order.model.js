const { Model, DataTypes, Sequelize } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');
const { COUPON_TABLE } = require('./coupon.model');
const { ORDER_PAYMENT_TABLE } = require('./order-payment-details.model');
const { CUSTOMER_ADDRESS_TABLE } = require('./customer-address.model');

const ORDER_TABLE = 'orders';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  totalAamount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total_amount',
  },
  totalAmountWithDiscount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total_amount_with_discount',
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  isCouponApplied: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    field: 'is_coupon_applied',
    defaultValue: false,
  },
  discountAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'discount_amount',
  },
  deliveredAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'delivered_at',
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  addressId: {
    field: 'address_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_ADDRESS_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  couponId: {
    field: 'coupon_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: COUPON_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  paymentId: {
    field: 'payment_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ORDER_PAYMENT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class Order extends Model {
  static associate(models) {
    //una orden tiene cliente
    this.belongsTo(models.Customer, {
      as: 'customer',
    });

    this.belongsTo(models.Coupon, {
      as: 'coupon',
    });

    this.belongsTo(models.OrderPayment, { as: 'payment' });

    //un orden puede tener varias orderProduct
    this.hasMany(models.OrderProduct, {
      as: 'orderProducts',
      foreignKey: 'orderId',
    });

    this.hasMany(models.OrderStatusHistory, {
      as: 'statusHistory',
      foreignKey: 'orderId',
    });

    this.belongsTo(models.CustomerAddress, {
      as: 'address',
    });

    //una orden  tiene un metodo de pago
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false,
    };
  }
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
