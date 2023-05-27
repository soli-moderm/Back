const { Model, DataTypes, Sequelize } = require('sequelize');

const {  PRODUCT_TABLE  } = require('./product.model')

const PRODUCT_IMAGES_TABLE = 'product_images';

const ProductImagesSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  filename: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
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

class Product_Images extends Model {

  static associate(models) {
    this.belongsTo(models.Product, {as: 'product'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_IMAGES_TABLE,
      modelName: 'Product_images',
      timestamps: false
    }
  }
}

module.exports = { Product_Images, ProductImagesSchema, PRODUCT_IMAGES_TABLE };
