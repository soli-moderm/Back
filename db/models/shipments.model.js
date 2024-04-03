
const { ORDER_TABLE } = require('./order.model');

const { Model, DataTypes, Sequelize } = require('sequelize');

const SHIPMENTS_TABLE = 'shipments';

const ShipmentsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    
    createdAt: {
        allowNull: true,
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
    status: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    trackingNumber: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'tracking_number',
    },
    trackingStatus: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'tracking_status',
    },
    labelUrl: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'label_url',
    },
    trackingUrlProvider: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'tracking_url_provider',
    },
    rateId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: 'rate_id',
    },
    labelId: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'label_id',
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
    };


class Shipments extends Model {
    static associate(models) {
        //un Shipment le pertenece a una orden
        this.belongsTo(models.Order, {
            as: 'order',
          });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: SHIPMENTS_TABLE,
            modelName: 'Shipments',
            timestamps: false,
        };
    }
}

module.exports = { Shipments, ShipmentsSchema, SHIPMENTS_TABLE };

