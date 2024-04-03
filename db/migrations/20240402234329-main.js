'use strict';

const { OrderSchema, ORDER_TABLE } = require('./../models/order.model');
const { UserSchema, USER_TABLE } = require('./../models/user.model');
const {
  CustomerSchema,
  CUSTOMER_TABLE,
} = require('./../models/customer.model');
const {
  CategorySchema,
  CATEGORY_TABLE,
} = require('./../models/category.model');
const { ProductSchema, PRODUCT_TABLE } = require('./../models/product.model');
const {
  OrderProductSchema,
  ORDER_PRODUCT_TABLE,
} = require('./../models/order-product.model');
const {
  ORDER_PAYMENT_TABLE,
  OrderPaymentSchema,
} = require('./../models/order-payment-details.model');
const {
  OrderStatusHistorySchema,
  ORDER_STATUS_HISTORY_TABLE,
} = require('./../models/order-status-history.model');
const { CouponSchema, COUPON_TABLE } = require('../models/coupon.model');
const {
  CustomerAddressSchema,
  CUSTOMER_ADDRESS_TABLE,
} = require('./../models/customer-address.model');
const {
  CustomerPaymentSchema,
  CUSTOMER_PAYMENT_TABLE,
} = require('./../models/customer-payment.model');
const {
  DiscountSchema,
  DISCOUNT_TABLE,
} = require('./../models/discount.model');
const {
  CategoryProductSchema,
  CATEGORY_PRODUCT_TABLE,
} = require('./../models/product-category.model');
const {
  ProductImagesSchema,
  PRODUCT_IMAGES_TABLE,
} = require('./../models/product-images.model');
const {
  ProductVariantSchema,
  PRODUCT_VARIANT_TABLE,
} = require('./../models/product-variant.model');

const {
  ShipmentsSchema,
  SHIPMENTS_TABLE,
} = require('./../models/shipments.model');
const { COMPANY_TABLE, CompanySchema } = require('../models/company.model');
const {
  PostalCodeSchema,
  POSTAL_CODE_TABLE,
} = require('../models/postal-code.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);
    await queryInterface.createTable(
      CUSTOMER_ADDRESS_TABLE,
      CustomerAddressSchema
    );

    await queryInterface.createTable(COUPON_TABLE, CouponSchema);
    await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
    await queryInterface.createTable(
      PRODUCT_VARIANT_TABLE,
      ProductVariantSchema
    );
    await queryInterface.createTable(ORDER_PAYMENT_TABLE, OrderPaymentSchema);

    await queryInterface.createTable(ORDER_TABLE, OrderSchema);
    await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema);

    await queryInterface.createTable(
      CUSTOMER_PAYMENT_TABLE,
      CustomerPaymentSchema
    );
    await queryInterface.createTable(
      ORDER_STATUS_HISTORY_TABLE,
      OrderStatusHistorySchema
    );

    await queryInterface.createTable(DISCOUNT_TABLE, DiscountSchema);
    await queryInterface.createTable(
      CATEGORY_PRODUCT_TABLE,
      CategoryProductSchema
    );
    await queryInterface.createTable(PRODUCT_IMAGES_TABLE, ProductImagesSchema);
    await queryInterface.createTable(COMPANY_TABLE, CompanySchema);
    await queryInterface.createTable(SHIPMENTS_TABLE, ShipmentsSchema);
    await queryInterface.createTable(POSTAL_CODE_TABLE, PostalCodeSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(CATEGORY_PRODUCT_TABLE);
    await queryInterface.dropTable(PRODUCT_IMAGES_TABLE);
    await queryInterface.dropTable(PRODUCT_VARIANT_TABLE);
    await queryInterface.dropTable(DISCOUNT_TABLE);
    await queryInterface.dropTable(CUSTOMER_PAYMENT_TABLE);

    await queryInterface.dropTable(ORDER_PAYMENT_TABLE);
    await queryInterface.dropTable(ORDER_STATUS_HISTORY_TABLE);
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
    await queryInterface.dropTable(CUSTOMER_ADDRESS_TABLE);
    await queryInterface.dropTable(COUPON_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(ORDER_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(COMPANY_TABLE);
    await queryInterface.dropTable(SHIPMENTS_TABLE);
    await queryInterface.dropTable(POSTAL_CODE_TABLE);
  },
};
