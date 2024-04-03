const { Model, DataTypes, Sequelize } = require('sequelize');

const ORDER_PAYMENT_TABLE = 'order_payment';

const OrderPaymentSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  paymentIntentsStripeId: {
    field: 'payment_intents_stripe_id',
    allowNull: true,
    type: DataTypes.STRING,
  },
  paymentMethodType: {
    field: ' payment_method_types',
    allowNull: true,
    type: DataTypes.STRING,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'total_amount',
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  paidAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'pais_at',
  },
};

class OrderPayment extends Model {
  static associate(models) {
    //un payment le pertenece a una orden
    this.hasOne(models.Order, {
      as: 'order',
      foreignKey: 'paymentId',
    });

    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PAYMENT_TABLE,
      modelName: 'OrderPayment',
      timestamps: false,
    };
  }
}

module.exports = { OrderPayment, OrderPaymentSchema, ORDER_PAYMENT_TABLE };
