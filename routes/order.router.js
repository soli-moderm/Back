const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const OrderService = require('../services/order.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('./../middlewares/auth.handler');
const {
  getOrderSchema,
  createOrderSchema,
  addItemSchema,
} = require('../schemas/order.schema');
const sedResponseSuccess = require('../utils/response');

const router = express.Router();
const service = new OrderService();

router.get(
  '/',
  // validatorHandler(queryProductSchema, 'query'),
  async (req, res, next) => {
    try {
      const orders = await service.find(req.query);

      res.status(201).json({
        status: 'success',
        message: 'Get ordenes',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  //  validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);

      res.status(201).json({
        status: 'success',
        message: 'Orden Create',
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/findOrdersByCustomer',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  async (req, res, next) => {
    console.log('🚀 ~ file: order.router.js:73 ~ req:', req);
    try {
      const userId = Number(req.user.id);

      const orders = await service.findOrdersByCustomerId(userId);

      res.status(200).json({
        status: 'success',
        message: 'Get ordenes',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/add-item',
  validatorHandler(addItemSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.addItem(body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  }
);

//applicationOrderCoupon
router.post('/applicationOrderCoupon', async (req, res, next) => {
  try {
    const body = req.body;
    const data = await service.applicationOrderCoupon(body);

    sedResponseSuccess(res, 201, 'Coupon Aplicado', data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
