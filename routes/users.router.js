const express = require('express');

const UserService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
  updateUserSchema,
  createUserSchema,
  getUserSchema,
  updateUserWhitPasswordAdminSchema,
} = require('../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const query = req.query;
    const users = await service.find(query);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const category = await service.update(id, body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/updateAdmin/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserWhitPasswordAdminSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const category = await service.updateWhitPasswordAdmin(id, body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
