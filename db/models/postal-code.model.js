const { Model, DataTypes, Sequelize } = require('sequelize');

const POSTAL_CODE_TABLE = 'postal_code';

const PostalCodeSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  zipCode: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  colony: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  settlementType: {
    field: 'settlement_type',
    allowNull: true,
    type: DataTypes.STRING,
  },
  municipality: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  state: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  city: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  area: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
};

class PostalCode extends Model {
  static associate() {
    // un codigo postal tiene muchos clientes
  }
  static config(sequelize) {
    return {
      tableName: POSTAL_CODE_TABLE,
      modelName: 'PostalCode',
      sequelize,
    };
  }
}

module.exports = { PostalCode, PostalCodeSchema, POSTAL_CODE_TABLE };
