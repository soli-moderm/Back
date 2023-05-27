const { Model, DataTypes, Sequelize } = require('sequelize');

const { CATEGORY_TABLE } = require('./category.model');
const { PRODUCT_TABLE } = require('./product.model');

const CATEGORY_PRODUCT_TABLE = 'category_products';

const CategoryProductSchema = {
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
  categoryId: {
    field: 'category_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORY_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  productId: {
    field: 'product_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
};

class CategoryProduct extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_PRODUCT_TABLE,
      modelName: 'CategoryProduct',
      timestamps: false,
    };
  }
}

module.exports = {
  CategoryProduct,
  CategoryProductSchema,
  CATEGORY_PRODUCT_TABLE,
};
