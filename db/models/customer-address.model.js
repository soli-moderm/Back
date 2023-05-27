const { Model, DataTypes, Sequelize } = require('sequelize');

const { CUSTOMER_TABLE } = require('./customer.model');

const CUSTOMER_ADDRESS_TABLE = 'customers_address';

const CustomerAddressSchema = {
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
  zipCode: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'zip_code',
  },
  state: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  municipality: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  colony: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  street: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  outdoorNumber: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'outdoor_number',
  },
  interiorNumber: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'interior-number',
  },
  betweenStreetOne: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'between_street_one',
  },
  betweenStreetTwo: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'between_street_two',
  },
  phoneContact: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'phone_contact',
  },
  additionalIndications: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'additional_indications',
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

class CustomerAddress extends Model {
  //una addres tiene cliente
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: 'customer',
    });
    this.hasMany(models.Order, {
      as: 'orders',
      foreignKey: 'addressId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_ADDRESS_TABLE,
      modelName: 'CustomerAddress',
      timestamps: false,
    };
  }
}

module.exports = {
  CustomerAddress,
  CustomerAddressSchema,
  CUSTOMER_ADDRESS_TABLE,
};
