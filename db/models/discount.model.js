const { Model, DataTypes, Sequelize } = require('sequelize');

const {  PRODUCT_TABLE  } = require('./product.model')

const DISCOUNT_TABLE = 'discounts';

const DiscountSchema =  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  discountPercentage: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'discount_percentage',
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
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  productId: {
    field: 'product_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model:  PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Discount extends Model {

  static associate(models) {
    //un descuento tiene una producto
    this.belongsTo(models.Product, {as: 'product'});
  }


  static config(sequelize) {
    return {
      sequelize,
      tableName: DISCOUNT_TABLE,
      modelName: 'Discount',
      timestamps: false
    }
  }
}

module.exports = { Discount, DiscountSchema, DISCOUNT_TABLE };
