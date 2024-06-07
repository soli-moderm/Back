const express = require('express');
const router = express.Router();

const { config } = require('../config/config');

const shipmentService = require('../services/shipment.service');

const service = new shipmentService();

router.post('/createShipment', async (req, res, next) => {
  try {
    const order = req.body;
    const result = await service.createShipment(order);
    res.json(result);
  } catch (error) {
    next(error);
  }
}   );

module.exports = router;