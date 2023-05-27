const { Model, DataTypes, Sequelize } = require('sequelize');

const { PRODUCT_TABLE } = require('./product.model');

const PRODUCT_VARIANT_TABLE = 'product_variant';

const ProductVariantSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promotionalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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

class Product_variant extends Model {
  static associate(models) {
    this.belongsTo(models.Product, { as: 'product' });
     //un producto_variant puede tener varias orderProduct
   this.hasMany(models.OrderProduct, {
    as: 'orders',
    foreignKey: 'product_variant_id',
  });
  }

  

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_VARIANT_TABLE,
      modelName: 'Product_variant',
      timestamps: false,
    };
  }
}

module.exports = {
  Product_variant,
  ProductVariantSchema,
  PRODUCT_VARIANT_TABLE,
};
