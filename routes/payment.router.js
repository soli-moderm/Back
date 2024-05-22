const express = require('express');
const router = express.Router();
const { config } = require('../config/config');

const paymentService = require('../services/payment.service');

const stripe = require('stripe')(config.stripePrivateKey);

const endpointSecret = config.endpointSecret;

const service = new paymentService();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      // Extract the signature from the request headers.

      const payload = req.body;
      const sig = req.headers['stripe-signature'];

      console.log('🚀 ~ file: stripe.router.js:17 ~ router.post ~ sig:', sig);

      let event = null;

      try {
        // Verify the webhook signature.
        event = await stripe.webhooks.constructEvent(
          payload,
          sig,
          endpointSecret
        );
        console.log(
          '🚀 ~ file: stripe.router.js:24 ~ router.post ~ event:',
          event
        );
      } catch (err) {
        console.log('🚀 ~ file: stripe.router.js:35 ~ router.post ~ err:', err);
        // If the signature verification fails, respond with an error.
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      let intent = null;
      switch (event['type']) {
        case 'payment_intent.succeeded':
          intent = event.data.object;
          console.log(' ✅ Succeeded Payment:', intent.id);
          service.paymentSucceeded(intent);
          break;
        case 'payment_intent.requires_action':
          intent = event.data.object;
          console.log('⏳ Payment requires action:', intent.id);
          service.paymentRequiresAction(intent);
          break;
        case 'payment_intent.payment_failed':
          intent = event.data.object;
          service.paymentFailed(intent);
          const message =
            intent.last_payment_error && intent.last_payment_error.message;
          console.log(' 🚫 Failed:', intent.id, message);
          break;
      }

      // If the signature verification succeeds, respond with a 2xx status code.
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
