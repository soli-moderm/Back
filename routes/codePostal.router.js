const express = require('express');

const sedResponseSuccess = require('../utils/response');

const CodePostalService = require('../services/codePostal.service');

const router = express.Router();

const service = new CodePostalService();

router.get('/', async (req, res, next) => {
  try {
    const query = req.query;
    const codePostals = await service.find(query);
    sedResponseSuccess(res, 200, 'Get CodePostals', codePostals);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const codePostal = await service.findOne(id);
    sedResponseSuccess(res, 200, 'Get CodePostal', codePostal);
  } catch (error) {
    next(error);
  }
});

module.exports = router;