const { Model, DataTypes, Sequelize } = require('sequelize');

const { CUSTOMER_TABLE } = require('./customer.model');

const CUSTOMER_PAYMENT_TABLE = 'customers_payments';

const CustomerPaymentSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  cardNumber: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'card_Number',
  },
  expirationDateMonth: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'expiration_date_month',
  },
  expirationDateYear: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'expiration_date_year',
  },
  brand: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  name:{
    allowNull: false,
    type: DataTypes.STRING,
  },
  tokenIdConekta:{
    allowNull: false,
    type: DataTypes.STRING,
    field: 'token_id_conekta',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
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
    onDelete: 'CASCADE',
  },
};

class Customer_Payment extends Model {

  //una payment tiene cliente
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_PAYMENT_TABLE,
      modelName: 'Customer_payment',
      timestamps: false
    }
  }
}

module.exports = { Customer_Payment , CustomerPaymentSchema, CUSTOMER_PAYMENT_TABLE };
