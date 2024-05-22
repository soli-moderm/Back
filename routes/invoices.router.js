const express = require('express');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const InvoicesService = require('../services/invoices.service');
const { checkRoles } = require('./../middlewares/auth.handler');
const validatorHandler = require('../middlewares/validator.handler');
const sedResponseSuccess = require('../utils/response');

const router = express.Router();

const service = new InvoicesService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  async (req, res, next) => {
    try {
      const query = req.query;
      const invoices = await service.find(query);
      sedResponseSuccess(res, 200, 'Get Invoices', invoices);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('Customer'),
  //   validatorHandler(createInvoiceSchema, 'body'),
  async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const payload = jwt.decode(token, process.env.AUTH_JWT_SECRET);
      const { sub } = payload;
      const userId = sub;
      console.log('🚀 ~ userId:', userId);
      const body = req.body;
      const newInvoice = await service.create({ body, userId });
      sedResponseSuccess(res, 200, 'Create Invoice', newInvoice);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;