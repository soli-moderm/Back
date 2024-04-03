const { Model, DataTypes, Sequelize } = require('sequelize');

const COMPANY_TABLE = 'company';

const CompanySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  phone:{
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  CompanyName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'company_name',
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
  
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class Company extends Model {
  static associate(models) {
    // define association here
    
   
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COMPANY_TABLE,
      modelName: 'Company',
      timestamps: false
    }
  }
}


module.exports = { COMPANY_TABLE, CompanySchema, Company }
