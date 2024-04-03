const express = require('express');

const passport = require('passport');

const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('./../middlewares/auth.handler');
const CompanyService = require('../services/company.service');

const sedResponseSuccess = require('../utils/response');

const router = express.Router();
const service = new CompanyService();

router.get(
  '/',
  // passport.authenticate('jwt', {session: false}),
  // //Verifica que se un password firmado por nosotros
  // checkRoles('admin', 'seller', 'customer'),
  //verifica que tenga un de los roles indicados
  async (req, res, next) => {
    try {
      const query = req.query;
      const companies = await service.find(query);
      sedResponseSuccess(res, 200, 'Get Companys', companies);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller', 'customer'),
  validatorHandler(getCompanySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const company = await service.findOne(id);
      sedResponseSuccess(res, 200, 'Get Company', company);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller'),
  validatorHandler(createCompanySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCompany = await service.create(body);
      sedResponseSuccess(res, 200, 'Create Company', newCompany);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller'),
  validatorHandler(getCompanySchema, 'params'),
  validatorHandler(updateCompanySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCompany = await service.update(id, { body });
      sedResponseSuccess(res, 200, 'Update Company', updatedCompany);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'seller'),
  validatorHandler(getCompanySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const company = await service.delete(id);
      sedResponseSuccess(res, 200, 'Delete Company', company);
    } catch (error) {
      next(error);
    }
  }
);
