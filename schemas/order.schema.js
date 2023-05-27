const Joi = require('joi');

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);

const name = Joi.string().min(3).max(50);
const email = Joi.string().email();
const phone = Joi.number();
const lastName = Joi.string();
const street = Joi.string();
const outdoorNumber = Joi.string();
const interiorNumber = Joi.string();
const zipCode = Joi.string();
const municipality = Joi.string();
const colony = Joi.string();
const additionalIndications = Joi.string();
const betweenStreetOne = Joi.string();
const betweenStreetTwo = Joi.string();
const promotionalPrice = Joi.number();
const status = Joi.boolean();
const stock = Joi.number().integer();
const price = Joi.number().optional();
const isProductWithVariant = Joi.bool();
const imgUrl = Joi.string();
const qty = Joi.number();
const addressName = Joi.string();

const productVariant = Joi.object({
  name: Joi.string().min(3).max(15),
  price: Joi.number(),
  promotionalPrice,
  id: Joi.any(),
  stock: stock.optional(),
  status: status.optional(),
});

const cartList = Joi.array().items(
  Joi.object({
    name: name.required(),
    price: price.required(),
    id: id.required(),
    isProductWithVariant: isProductWithVariant.required(),
    imgUrl: imgUrl.required(),
    productVariant: productVariant.optional(),
    qty: qty.required(),
  })
);

const cardToken = Joi.string();

const dataPersonalInformation = Joi.object({
  name: name.required(),
  email: email.required(),
  phone: phone.required(),
  lastName: lastName.required(),
  street: street.required(),
  outdoorNumber: outdoorNumber.required(),
  interiorNumber: interiorNumber.optional().allow(''),
  zipCode: zipCode.required(),
  municipality: municipality.required(),
  colony: colony.required(),
  additionalIndications: additionalIndications.optional(),
  betweenStreetOne: betweenStreetOne.optional(),
  betweenStreetTwo: betweenStreetTwo.optional(),
  addressName: addressName.optional(),
});

const getOrderSchema = Joi.object({
  id: id.required(),
});

const createOrderSchema = Joi.object({
  dataPersonalInformation: dataPersonalInformation.required(),
  cartList: cartList.required(),
});

const addItemSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
});

module.exports = { getOrderSchema, createOrderSchema, addItemSchema };
