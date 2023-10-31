const Joi = require('joi');

const createCouponSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string().min(3).max(100).required(),
  discount: Joi.number().min(1).required(),
  usageLimit: Joi.number().min(1),
  timesUsed: Joi.number().min(0),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  minimumPurchase: Joi.number().min(1),
  maximumDiscount: Joi.number().min(1),
});

const updateCouponSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  type: Joi.string().min(3).max(100),
  status: Joi.string().min(3).max(100),
  discount: Joi.number().min(1),
  usageLimit: Joi.number().min(1),
  timesUsed: Joi.number(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  minimumPurchase: Joi.number().min(1),
  maximumDiscount: Joi.number().min(1),
  createdAt: Joi.date(),
  id: Joi.number().integer().required(),
});

const getCouponSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  createCouponSchema,
  updateCouponSchema,
  getCouponSchema,
};
