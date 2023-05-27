const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const CustomerService = require('../services/customers.service');
const validationHandler = require('../middlewares/validator.handler');
const {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
} = require('../schemas/customer.schema');

const { checkRoles } = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new CustomerService();

router.get('/', async (req, res, next) => {
  try {
    const resp = await service.find(req.query);

    res.status(201).send({
      status: 'success',
      message: 'Get customers',
      data: resp,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validationHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validationHandler(getCustomerSchema, 'params'),
  validationHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      res.status(201).json(await service.update(id, body));
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      res.status(200).json(await service.delete(id));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/findAddress',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);

      console.log('🚀 ~ file: customers.route.js:82 ~ payload:', payload);

      const { sub } = payload;
      const address = await service.findAddress(sub);

      res.status(201).json({
        status: 'success',
        message: 'Get address',
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }
);



router.get(
  '/findCustomer',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);

      const { sub } = payload;
      const resp = await service.findCustomerId(sub);
      res.status(201).send({
        status: 'success',
        message: 'Get customer',
        data: resp,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
