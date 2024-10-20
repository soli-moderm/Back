const express = require('express');
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const orderRouter = require('./order.router');
const customersRouter = require('./customers.route');
const authRouter = require('./auth.router');
const imagesRouter = require('./images.router');
const stipeRouter = require('./payment.router');
const customerAddressRouter = require('./customerAddress.router');
const couponRouter = require('./coupon.router');
const codePostalRouter = require('./codePostal.router');
const invoicesRouter = require('./invoices.router');
const shipmentsRouter = require('./shipments.router');
const contact = require('./contact.router');

const routerApi = (app) => {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/customers', customersRouter);
  router.use('/auth', authRouter);
  router.use('/images', imagesRouter);
  router.use('/webhook', stipeRouter);
  router.use('/customerAddress', customerAddressRouter);
  router.use('/coupon', couponRouter);
  router.use('/codePostal', codePostalRouter);
  router.use('/invoices', invoicesRouter);
  router.use('/shipments', shipmentsRouter);
  router.use('/contact', contact);
};

module.exports = routerApi;
