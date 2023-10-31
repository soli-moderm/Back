const { Model, DataTypes, Sequelize } = require('sequelize');
const { ORDER_TABLE } = require('./order.model');

const ORDER_STATUS_HISTORY_TABLE = 'order_status_history';
const { USER_TABLE } = require('./user.model');

const OrderStatusHistorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  orderId: {
    field: 'order_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ORDER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  userId: {
    field: 'user_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  dateTimeChange: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'date_time_change',
    defaultValue: Sequelize.NOW,
  },
};

class OrderStatusHistory extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: 'user',
    });

    this.belongsTo(models.Order, {
      as: 'order',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_STATUS_HISTORY_TABLE,
      modelName: 'OrderStatusHistory',
      timestamps: false,
    };
  }
}

module.exports = {
  OrderStatusHistory,
  OrderStatusHistorySchema,
  ORDER_STATUS_HISTORY_TABLE,
};
