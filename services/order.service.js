const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');
const conekta = require('conekta');
const { config } = require('../config/config');

const typeStatusOrder = require('../utils/typeStatusOrder');
const { Coupon } = require('../db/models/coupon.model');
const paginate = require('../utils/paginate');

const stripe = require('stripe')(config.stripePrivateKey);

// id: string | number;
// name: string;
// qty: number;
// price: number;
// imgUrl?: string;
// isProductWithVariant: boolean;
// productVariant: productVariant;

// id: string | number;
//   name: string;
//   price: number;
//   promotionalPrice: number;
//   status: boolean;
//   stock: number;

const unitPrice = (item) => {
  let priceUnit = 0;
  if (item.isProductWithVariant) {
    const { promotionalPrice, price } = item.productVariant;
    priceUnit = promotionalPrice || price;
  } else {
    const { promotionalPrice, price } = item;
    priceUnit = promotionalPrice || price;
  }
  return priceUnit;
};

const calculateOrderAmount = (items) => {
  return items.reduce((totalAmount, item) => {
    const itemAmount = unitPrice(item) * item.qty;
    return itemAmount + totalAmount;
  }, 0);
};

class OrderService {
  constructor() {}

  async create(data) {
    const {
      name,
      email,
      phone,
      lastName,
      street,
      outdoorNumber,
      interiorNumber,
      zipCode,
      municipality,
      colony,
      additionalIndications,
      betweenStreetOne,
      betweenStreetTwo,
      addressName,
    } = data.dataPersonalInformation;
    const { idAddress, userId } = data;

    console.log(
      '🚀 ~ file: order.service.js:11 ~ OrderService ~ create ~ data',
      data
    );
    let newUser = null;
    let newCustomer = null;
    let newAddressCustomer = null;

    // // crear Cliente en db
    if (!userId) {
      newUser = await models.User.create({
        email,
        role: 'Customer',
      }).catch((error) => {
        throw boom.badRequest(error);
      });

      console.log(
        '🚀 ~ file: order.service.js:35 ~ OrderService ~ create ~ newUser',
        newUser
      );
    }

    const customerExists = await models.Customer.findOne({
      where: { userId: userId },
    }).catch((error) => boom.badRequest(error));

    if (!customerExists) {
      newCustomer = await models.Customer.create({
        name: name,
        lastName: lastName,
        phone: phone,
        userId: newUser.id,
      }).catch((error) => boom.badRequest(error));

      console.log(
        '🚀 ~ file: order.service.js:39 ~ OrderService ~ create ~ newCustomer',
        newCustomer
      );
    }

    if (!idAddress) {
      newAddressCustomer = await models.CustomerAddress.create({
        name: addressName,
        zipCode,
        state: 'Jalisco',
        municipality,
        colony,
        street,
        outdoorNumber: Number(outdoorNumber),
        interiorNumber: Number(outdoorNumber),
        betweenStreetOne,
        betweenStreetTwo,
        phoneContact: phone.toString(),
        additionalIndications,
        customerId: newCustomer.id,
      }).catch((error) => boom.badRequest(error));

      console.log(
        '🚀 ~ file: order.service.js:55 ~ OrderService ~ create ~ newAddressCustomer',
        newAddressCustomer
      );
    }

    const totalAamount = calculateOrderAmount(data.cartList);
    console.log(
      '🚀 ~ file: order.service.js:115 ~ OrderService ~ create ~ totalAamount:',
      totalAamount
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAamount * 100,
      currency: 'mxn',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(
      '🚀 ~ file: order.service.js:130 ~ OrderService ~ create ~ paymentIntent',
      paymentIntent
    );

    const newPaymentDetail = await models.OrderPayment.create({
      paymentIntentsStripeId: paymentIntent.id,
      paymentMethodType: paymentIntent.payment_method_types[0],
      totalAamount: totalAamount,
      status: paymentIntent.status,
    }).catch((error) => boom.badRequest(error));
    console.log(
      '🚀 ~ file: order.service.js:130 ~ OrderService ~ create ~ newPaymentDetail:',
      newPaymentDetail
    );

    const orderObject = {
      totalAamount,
      customerId: customerExists ? customerExists.id : newCustomer.id,
      status: typeStatusOrder.ESPERANDO_CONFIRMACION_DE_PAGO,
      paymentId: newPaymentDetail.id,
      addressId: idAddress ? idAddress : newAddressCustomer.id,
    };

    if (data?.coupon) {
      orderObject.couponId = data?.coupon.id;
    }

    const newOrder = await models.Order.create(orderObject).catch((error) =>
      console.log(
        '🚀 ~ file: order.service.js:176 ~ OrderService ~ create ~ error:',
        error
      )
    );
    console.log(
      '🚀 ~ file: order.service.js:92 ~ OrderService ~ create ~ newOrder',
      newOrder
    );

    const productsForOrder = data?.cartList.map((item) => {
      const objectItem = {
        orderId: newOrder.id,
        quantity: item.qty,
        unitPrice: unitPrice(item),
        productId: item.id,
      };

      if (item.isProductWithVariant) {
        objectItem.productVariantId = item.productVariant.id;
      }
      return objectItem;
    });

    try {
      await models.OrderProduct.bulkCreate(productsForOrder);
    } catch (error) {
      return boom.badRequest(error);
    }

    return {
      id: newOrder.id,
      clientSecret: paymentIntent.client_secret,
      customerId: customerExists ? customerExists.id : newCustomer.id,
      userId: userId ? userId : newUser.id,
    };
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find(query) {
    const { page, pageSize, status, startDate, endDate, searchString } = query;
    console.log(
      '🚀 ~ file: order.service.js:198 ~ OrderService ~ find ~ searchString:',
      searchString
    );
    const { limit, offset } = paginate(page, pageSize);
    const isNumeric = (n) => !!Number(n);

    // search for customers by name or last name
    const whererCustomer =
      searchString && !isNumeric(searchString)
        ? {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `%${searchString}%`,
                },
              },
              {
                lastName: {
                  [Op.iLike]: `%${searchString}%`,
                },
              },
            ],
          }
        : null;
    console.log(
      '🚀 ~ file: order.service.js:208 ~ OrderService ~ find ~ whererCustomer:',
      whererCustomer
    );

    const options = {
      include: [
        {
          model: models.Customer,
          as: 'customer',
          // If there's a search string, filter by customer name
          where: whererCustomer,
        },
        {
          model: models.OrderPayment,
          as: 'payment',
        },
        // {
        //   model: models.OrderProduct,
        //   as: 'orderProducts',
        //   include: [
        //     {
        //       model: models.Product,
        //       as: 'product',
        //     },
        //     {
        //       model: models.Product_variant,
        //       as: 'product_variant',
        //     },
        //   ],
        // },
      ],
      order: [['createdAt', 'DESC']],
    };

    if (status && status !== 'Todas') {
      options.where = {
        status,
      };
    }

    if (startDate && endDate) {
      options.where = {
        ...options.where,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    // Check if the searchString is a number
    if (isNumeric(searchString)) {
      // Add the number as a where clause to the options object
      options.where = {
        ...options.where,
        id: Number(searchString),
      };
    }

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    console.log(
      '🚀 ~ file: order.service.js:198 ~ OrderService ~ find ~ options:',
      options
    );

    const orders = await models.Order.findAll(options);
    const count = await models.Order.count();
    return { orders, count };
  }

  async findOrdersByCustomerId(userId) {
    const customer = await models.Customer.findOne({
      where: {
        userId,
      },
      attributes: ['id'],
    }).catch((error) => boom.badRequest(error));

    const orders = await models.Order.findAll({
      where: {
        customerId: customer.id,
      },
    }).catch((error) => boom.badRequest(error));
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'payment',
          as: 'payment',
        },
        {
          association: 'address',
          as: 'address',
        },
        {
          association: 'orderProducts',
          include: [
            {
              association: 'product',
              as: 'product',
              include:{
                model: models.Product_images,
                as: 'product_images',
                attributes: ['filename'],
              },
            },
            {
              association: 'product_variant',
            },
          ],
        },
      ],
    }).catch((error) => boom.badRequest(error));

    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = OrderService;
