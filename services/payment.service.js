const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

const { config } = require('../config/config');

const typeStatusOrder = require('../utils/typeStatusOrder');

const stripe = require('stripe')(config.stripePrivateKey);

class paymentService {
  constructor() {}

  async paymentSucceeded(paymentIntent) {
    const payment = await models.OrderPayment.findAll({
      where: { paymentIntentsStripeId: paymentIntent.id },
    }).catch((error) => boom.badRequest(error));

    if (payment.length > 0) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );
      const paymentUpdate = await models.OrderPayment.update(
        {
          status: paymentIntent.status,
          paymentMethodType: paymentMethod.type,
          totalAamount: paymentIntent.amount / 100,
          paidAt: new Date(),
        },
        {
          where: {
            paymentIntentsStripeId: paymentIntent.id,
          },
        }
      ).catch((error) => boom.badRequest(error));

      const order = await models.Order.findAll({
        where: { paymentId: payment[0].id },
      }).catch((error) => boom.badRequest(error));

      if (order.length > 0) {
        const orderUpdate = await models.Order.update(
          { status: typeStatusOrder.PAGADA },
          {
            where: { id: order[0].id },
          }
        ).catch((error) => boom.badRequest(error));

        return orderUpdate;
      }
    }
  }
  async paymentRequiresAction(paymentIntent) {
    const payment = await models.OrderPayment.findAll({
      where: { paymentIntentsStripeId: paymentIntent.id },
    }).catch((error) => boom.badRequest(error));

    if (payment.length > 0) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );

      const paymentUpdate = await models.OrderPayment.update(
        {
          status: paymentIntent.status,
          paymentMethodType: paymentMethod.type,
          totalAamount: paymentIntent.amount / 100,
        },
        {
          where: {
            paymentIntentsStripeId: paymentIntent.id,
          },
        }
      ).catch((error) => boom.badRequest(error));

      const order = await models.Order.findAll({
        where: { paymentId: payment[0].id },
      }).catch((error) => boom.badRequest(error));

      if (order.length > 0) {
        const orderUpdate = await models.Order.update(
          { status: typeStatusOrder.PAGO_REQUIERE_ACCION },
          {
            where: { id: order[0].id },
          }
        ).catch((error) => boom.badRequest(error));

        return orderUpdate;
      }
    }
  }

  async paymentFailed(paymentIntent) {
    const payment = await models.OrderPayment.findAll({
      where: { paymentIntentsStripeId: paymentIntent.id },
    }).catch((error) => boom.badRequest(error));

    if (payment.length > 0) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );
      const paymentUpdate = await models.OrderPayment.update(
        {
          status: paymentIntent.status,
          paymentMethodType: paymentMethod.type,
          totalAamount: paymentIntent.amount / 100,
        },
        {
          where: {
            paymentIntentsStripeId: paymentIntent.id,
          },
        }
      ).catch((error) => boom.badRequest(error));

      const order = await models.Order.findAll({
        where: { paymentId: payment[0].id },
      }).catch((error) => boom.badRequest(error));

      if (order.length > 0) {
        const orderUpdate = await models.Order.update(
          { status: typeStatusOrder.PAGO_RECHAZADO },
          {
            where: { id: order[0].id },
          }
        ).catch((error) => boom.badRequest(error));

        return orderUpdate;
      }
    }
  }
}

module.exports = paymentService;
