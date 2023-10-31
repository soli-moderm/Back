const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const {
  createCouponSchema,
  updateCouponSchema,
  getCouponSchema,
} = require('../schemas/coupon.schema');
const CouponService = require('../services/coupon.service');

const sedResponseSuccess = require('../utils/response');

const router = express.Router();
const service = new CouponService();

router.get('/', async (req, res, next) => {
  try {
    const query = req.query;
    const coupons = await service.find(query);
    sedResponseSuccess(res, 200, 'Get Coupons', coupons);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getCouponSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const coupon = await service.findOne(id);
      sedResponseSuccess(res, 200, 'Get Coupon', coupon);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createCouponSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCoupon = await service.create(body);
      sedResponseSuccess(res, 201, 'Create Coupon', newCoupon);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getCouponSchema, 'params'),
  validatorHandler(updateCouponSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const coupon = await service.update(id, body);
      sedResponseSuccess(res, 200, 'Update Coupon', coupon);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getCouponSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const coupon = await service.delete(id);
      sedResponseSuccess(res, 200, 'Delete Coupon', coupon);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
