const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { models } = require('../libs/sequelize');
const paginate = require('../utils/paginate');
const { Op } = require('sequelize');

class CustomerAddressService {
  constructor() {}

  async addAddress({ data, userId }) {
    console.log(
      '🚀 ~ file: customerAddress.service.js:12 ~ CustomerAddressService ~ addAddress ~  data, userId :',
      data,
      userId
    );
    const customerId = await models.Customer.findOne({
      where: { userId: userId },
      attributes: ['id'],
    }).catch((error) => boom.badRequest(error));
    console.log(
      '🚀 ~ file: customerAddress.service.js:21 ~ CustomerAddressService ~ addAddress ~ customerId:',
      customerId
    );

    const {
      addressName,
      zipCode,
      state,
      municipality,
      colony,
      street,
      outdoorNumber,
      interiorNumber,
      betweenStreetOne,
      betweenStreetTwo,
      additionalIndications,
    } = data;

    const address = await models.CustomerAddress.create({
      name: addressName,
      zipCode,
      state: 'Jalisco',
      municipality,
      colony,
      street,
      outdoorNumber: Number(outdoorNumber),
      interiorNumber: Number(interiorNumber),
      betweenStreetOne,
      betweenStreetTwo,
      additionalIndications,
      customerId: customerId.id,
    }).catch((error) => boom.badRequest(error));

    return address;
  }

  async findAddressById(id) {
    const rta = await models.CustomerAddress.findByPk(id).catch((error) =>
      boom.badRequest(error)
    );
    console.log(
      '🚀 ~ file: customersAddress.service.js:50 ~ CustomerAddressService ~ findAddressById ~ rta:',
      rta
    );

    return rta;
  }

  async findAddressByCustomerId(userId) {
    console.log(
      '🚀 ~ file: customerAddress.service.js:62 ~ CustomerAddressService ~ findAddressByCustomerId ~ userId:',
      userId
    );
    const customerId = await models.Customer.findOne({
      where: { userId: userId },
    }).catch((error) => boom.badRequest(error));
    console.log(
      '🚀 ~ file: customerAddress.service.js:69 ~ CustomerAddressService ~ findAddressByCustomerId ~ customerId:',
      customerId
    );

    const rta = await models.CustomerAddress.findAll({
      where: { customerId: customerId.id },
    }).catch((error) => boom.badRequest(error));
    console.log(
      '🚀 ~ file: customersAddress.service.js:67 ~ CustomerAddressService ~ findAddressByCustomerId ~ rta:',
      rta
    );
    return rta;
  }

  async updateAddress(id, data) {
    const {
      addressName,
      zipCode,
      state,
      municipality,
      colony,
      street,
      outdoorNumber,
      interiorNumber,
      betweenStreetOne,
      betweenStreetTwo,
      additionalIndications,
    } = data;

    const address = await models.CustomerAddress.update(
      {
        name: addressName,
        zipCode,
        state: 'Jalisco',
        municipality,
        colony,
        street,
        outdoorNumber: Number(outdoorNumber),
        interiorNumber: Number(interiorNumber),
        betweenStreetOne,
        betweenStreetTwo,
        additionalIndications,
      },
      {
        where: {
          id,
        },
      }
    ).catch((error) => boom.badRequest(error));

    return address;
  }

  async deleteAddress(id, userId) {
    const address = await models.CustomerAddress.destroy({
      where: {
        id,
      },
    }).catch((error) => boom.badRequest(error));

    const customerId = await models.Customer.findOne({
      where: { userId: userId },
    }).catch((error) => boom.badRequest(error));

    const rta = await models.CustomerAddress.findAll({
      where: { customerId: customerId.id },
    }).catch((error) => boom.badRequest(error));

    return rta;
  }
}

module.exports = CustomerAddressService;
