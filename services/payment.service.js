const boom = require('@hapi/boom');

const ShipmentsService = require('./shipments.service');

const { models } = require('../libs/sequelize');

const { config } = require('../config/config');

const { formatDate } = require('../utils/formatDate');

const { typeStatusOrder } = require('../utils/typeStatus');
const { sendEmailWithTemplate } = require('../utils/sendEmail');

const stripe = require('stripe')(config.stripePrivateKey);

const serviceShipments = new ShipmentsService();

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
      await models.OrderPayment.update(
        {
          status: paymentIntent.status,
          paymentMethodType: paymentMethod.type,
          totalAmount: paymentIntent.amount / 100,
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
        include: [
          { model: models.Customer, as: 'customer', include: ['user'] },
        ],
      }).catch((error) => boom.badRequest(error));

      console.log('🚀 ~ paymentService ~ paymentSucceeded ~ order:', order[0]);

      if (order.length > 0) {
        // Actualizar inventario de productos

        const orderProducts = await models.OrderProduct.findAll({
          where: { orderId: order[0].id },
        }).catch((error) => boom.badRequest(error));

        orderProducts.forEach(async (item) => {
          if (item.product_variant_id) {
            const productVariant = await models.ProductVariant.findOne({
              where: { id: item.product_variant_id },
            }).catch((error) => boom.badRequest(error));

            const newStock = productVariant.stock - item.quantity;

            if (newStock === 0) {
              await models.ProductVariant.update(
                { stock: newStock, status: false },
                {
                  where: { id: item.product_variant_id },
                }
              ).catch((error) => boom.badRequest(error));
            } else {
              await models.ProductVariant.update(
                { stock: newStock },
                {
                  where: { id: item.product_variant_id },
                }
              ).catch((error) => boom.badRequest(error));
            }
          } else {
            const product = await models.Product.findOne({
              where: { id: item.productId },
            }).catch((error) => boom.badRequest(error));

            const newStock = product.stock - item.quantity;

            if (newStock === 0) {
              await models.Product.update(
                { stock: newStock, status: false },
                {
                  where: { id: item.productId },
                }
              ).catch((error) => boom.badRequest(error));
            } else {
              await models.Product.update(
                { stock: newStock },
                {
                  where: { id: item.productId },
                }
              ).catch((error) => boom.badRequest(error));
            }
          }
        });

        const orderUpdate = await models.Order.update(
          { status: typeStatusOrder.PAGADA },
          {
            where: { id: order[0].id },
          }
        ).catch((error) => boom.badRequest(error));

        const newStatus = await models.OrderStatusHistory.create({
          orderId: order[0].id,
          status: typeStatusOrder.PAGADA,
        }).catch((error) => boom.badRequest(error));
        console.log(
          '🚀 ~ file: payment.service.js:57 ~ paymentService ~ paymentSucceeded ~ newStatus:',
          newStatus
        );

        const { email } = order[0].customer.user;

        const dataObject = await this.createObjectDataForEmail(order[0].id);

        sendEmailWithTemplate(
          email,
          '¡Tu pedido ha sido confirmado! 🚀',
          '¡Tu pedido ha sido confirmado! 🚀',
          'd-3754e0d2f1d14f3892e71fe9b0ca18a7',
          dataObject
        );

        // Shipments
        try {
          const shipments = serviceShipments.createShipment(order[0]);
          console.log(
            '🚀 ~ file: payment.service.js:65 ~ paymentService ~ paymentSucceeded ~ shipments',
            shipments
          );
        } catch (error) {
          console.log(
            '🚀 ~ file: payment.service.js:65 ~ paymentService ~ paymentSucceeded ~ error',
            error
          );
        }

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
          totalAmount: paymentIntent.amount / 100,
        },
        {
          where: {
            paymentIntentsStripeId: paymentIntent.id,
          },
        }
      ).catch((error) => boom.badRequest(error));

      const order = await models.Order.findAll({
        where: { paymentId: payment[0].id },
        include: [
          { model: models.Customer, as: 'customer', include: ['user'] },
        ],
      }).catch((error) => boom.badRequest(error));

      if (order.length > 0) {
        const orderUpdate = await models.Order.update(
          { status: typeStatusOrder.PAGO_REQUIERE_ACCION },
          {
            where: { id: order[0].id },
          }
        ).catch((error) => boom.badRequest(error));

        const newStatus = await models.OrderStatusHistory.create({
          orderId: order[0].id,
          status: typeStatusOrder.PAGO_REQUIERE_ACCION,
        }).catch((error) => boom.badRequest(error));
        console.log(
          '🚀 ~ file: payment.service.js:101 ~ paymentService ~ paymentRequiresAction ~ newStatus:',
          newStatus
        );
        const { email } = order[0].customer.user;

        const dataObject = await this.createObjectDataForEmail(order[0].id);

        sendEmailWithTemplate(
          email,
          'Información importante sobre tu pedido',
          'Información importante sobre tu pedido',
          'd-77ffd772d7dc44c1aef703e6ca3f14b2',
          dataObject
        );

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
          totalAmount: paymentIntent.amount / 100,
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

        const newStatus = await models.OrderStatusHistory.create({
          orderId: order[0].id,
          status: typeStatusOrder.PAGO_RECHAZADO,
        }).catch((error) => boom.badRequest(error));
        console.log(
          '🚀 ~ file: payment.service.js:149 ~ paymentService ~ paymentFailed ~ newStatus:',
          newStatus
        );

        return orderUpdate;
      }
    }
  }

  async createObjectDataForEmail(orderId) {
    const order = await models.Order.findAll({
      where: { id: orderId },
    }).catch((error) => boom.badRequest(error));

    if (order.length > 0) {
      const { subtotalAmount, discountAmount, totalAmount } = order[0];

      const orderProducts = await models.OrderProduct.findAll({
        where: { orderId: order[0].id },
        include: [
          {
            association: 'product',
            as: 'product',
            include: {
              model: models.Product_images,
              as: 'product_images',
              attributes: ['filename'],
            },
          },
          {
            association: 'product_variant',
          },
        ],
      }).catch((error) => boom.badRequest(error));

      const itemsForEmail = orderProducts.map((item) => {
        const urlImage = `https://www.app.solimoderm.com/api/v1/images/${item.product.product_images[0].filename}`;
        return {
          name: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.unitPrice * item.quantity,
          image: urlImage,
        };
      });

      const CustomerAddress = await models.CustomerAddress.findOne({
        include: [
          { model: models.Customer, as: 'customer', include: ['user'] },
        ],
        where: { id: order[0].addressId },
      });

      const { name, lastName, user } = CustomerAddress.customer;
      const { email } = user;

      const orderAddress = `${CustomerAddress?.street || ''} #${
        CustomerAddress?.outdoorNumber || ''
      } ${CustomerAddress?.interiorNumber || ''} ${
        CustomerAddress?.colony || ''
      } ${CustomerAddress?.municipality || ''} ${
        CustomerAddress?.zipCode || ''
      }`;

      return {
        name: name,
        lastName: lastName,
        email: email,
        items: itemsForEmail,
        orderId: order[0].id,
        orderDate: formatDate(order[0].createdAt),
        orderTotal: totalAmount,
        orderSubtotal: subtotalAmount,
        orderDiscount: discountAmount,
        orderAddress: orderAddress,
      };
    }
  }
}

module.exports = paymentService;
