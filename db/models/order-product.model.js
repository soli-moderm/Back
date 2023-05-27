const { Model, DataTypes, Sequelize } = require('sequelize');

const { ORDER_TABLE } = require('./order.model');
const { PRODUCT_TABLE } = require('./product.model');
const { PRODUCT_VARIANT_TABLE } = require('./product-variant.model');

const ORDER_PRODUCT_TABLE = 'orders_products';

const OrderProductSchema = {
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
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  unitPrice: {
    allowNull: false,
    type: DataTypes.FLOAT,
    field: 'unit_price',
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
  productId: {
    field: 'product_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  productVariantId: {
    field: 'product_variant_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_VARIANT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
};

class OrderProduct extends Model {
  static associate(models) {
    //un order Product tiene un producto
    this.belongsTo(models.Product, {
      as: 'product',
    });
    //un order Product tiene una variante de producto
    this.belongsTo(models.Product_variant, {
      as: 'product_variant',
    });
    //un order Product tiene una orden
    this.belongsTo(models.Order, {
      as: 'order',
    });

    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: 'OrderProduct',
      timestamps: false,
    };
  }
}

module.exports = { OrderProduct, OrderProductSchema, ORDER_PRODUCT_TABLE };
