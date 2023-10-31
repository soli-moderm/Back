const { User, UserSchema } = require('./user.model');
const { Customer, CustomerSchema } = require('./customer.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderProduct, OrderProductSchema } = require('./order-product.model');
const {
  OrderPayment,
  OrderPaymentSchema,
} = require('./order-payment-details.model');

const {
  OrderStatusHistory,
  OrderStatusHistorySchema,
} = require('./order-status-history.model');
const { Coupon, CouponSchema } = require('./coupon.model');
const {
  CustomerAddress,
  CustomerAddressSchema,
} = require('./customer-address.model');
const {
  Customer_Payment,
  CustomerPaymentSchema,
} = require('./customer-payment.model');
const { Discount, DiscountSchema } = require('./discount.model');
const {
  CategoryProduct,
  CategoryProductSchema,
} = require('./product-category.model');
const {
  Product_Images,
  ProductImagesSchema,
} = require('./product-images.model');
const {
  Product_variant,
  ProductVariantSchema,
} = require('./product-variant.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Coupon.init(CouponSchema, Coupon.config(sequelize));
  CustomerAddress.init(
    CustomerAddressSchema,
    CustomerAddress.config(sequelize)
  );
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));
  OrderPayment.init(OrderPaymentSchema, OrderPayment.config(sequelize));
  OrderStatusHistory.init(
    OrderStatusHistorySchema,
    OrderStatusHistory.config(sequelize)
  );
  Customer_Payment.init(
    CustomerPaymentSchema,
    Customer_Payment.config(sequelize)
  );
  Discount.init(DiscountSchema, Discount.config(sequelize));
  CategoryProduct.init(
    CategoryProductSchema,
    CategoryProduct.config(sequelize)
  );
  Product_Images.init(ProductImagesSchema, Product_Images.config(sequelize));
  Product_variant.init(ProductVariantSchema, Product_variant.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  CustomerAddress.associate(sequelize.models);
  Order.associate(sequelize.models);
  OrderPayment.associate(sequelize.models);
  OrderStatusHistory.associate(sequelize.models);
  OrderProduct.associate(sequelize.models);
  Coupon.associate(sequelize.models);
  Customer_Payment.associate(sequelize.models);
  Discount.associate(sequelize.models);
  CategoryProduct.associate(sequelize.models);
  Product_Images.associate(sequelize.models);
  Product_variant.associate(sequelize.models);
}

module.exports = setupModels;
