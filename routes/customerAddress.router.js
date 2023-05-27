const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const CustomerAddressService = require('../services/customerAddress.service');
const validationHandler = require('../middlewares/validator.handler');
const {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
} = require('../schemas/customer.schema');

const { checkRoles } = require('./../middlewares/auth.handler');

const router = express.Router();

const service = new CustomerAddressService();

router.get('/findAddressById/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(201).json(await service.findAddressById(id));
  } catch (error) {
    next(error);
  }
});

router.get(
  '/findAddress',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      console.log(
        '🚀 ~ file: customerAddress.router.js:39 ~ authorization:',
        authorization
      );
      const token = authorization.split(' ')[1];
      const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);
      console.log(
        '🚀 ~ file: customerAddress.router.js:41 ~ payload:',
        payload
      );

      const { sub } = payload;
      const address = await service.findAddressByCustomerId(sub);

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

router.post(
  '/',
  // validationHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);

      console.log('🚀 ~ file: customers.route.js:82 ~ payload:', payload);

      const { sub } = payload;
      const body = req.body;
      res
        .status(201)
        .json(await service.addAddress({ data: body, userId: sub }));
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  // validationHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      res.status(201).json(await service.updateAddress(id, body));
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);
    console.log(
      '🚀 ~ file: customerAddress.router.js:104 ~ router.delete ~ payload:',
      payload
    );

    const { sub } = payload;
    const userId = sub;
    res.status(201).json(await service.deleteAddress(id, userId));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
