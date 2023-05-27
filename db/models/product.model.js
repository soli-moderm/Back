const { Model, DataTypes, Sequelize } = require('sequelize');

const PRODUCT_TABLE = 'products';

const ProductSchema = {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
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
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
};

class Product extends Model {
  static associate(models) {
    // una Producto puede tener varias imagenes
    this.hasMany(models.Product_images, {
      as: 'product_images',
      foreignKey: 'product_id',
    });
    // una Producto puede tener varias variantes
    this.hasMany(models.Product_variant, {
      as: 'product_variant',
      foreignKey: 'product_id',
    });

    //un producto tiene varias categorias
    this.belongsToMany(models.Category, {
      as: 'category',
      through: models.CategoryProduct,
      foreignKey: 'productId',
      otherKey: 'categoryId',
    });
   //un producto puede tener varias orderProduct
    this.hasMany(models.OrderProduct, {
      as: 'orders',
      foreignKey: 'product_id',
    });
  
    
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false,
    };
  }
}

module.exports = { Product, ProductSchema, PRODUCT_TABLE };
