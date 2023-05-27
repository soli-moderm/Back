const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { models } = require('../libs/sequelize');
const paginate = require('../utils/paginate');
const { Op } = require('sequelize');

class CustomerService {
  constructor() {}

  async find(query) {
    const { page, pageSize, searchString } = query;

    const { limit, offset } = paginate(page, pageSize);

    const options = {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        {
          model: models.CustomerAddress,
          as: 'address',
        },
      ],
      where: searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {},
    };

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const rta = await models.Customer.findAll(options);
    return rta;
  }

  async findCustomerId(userId) {
    const options = {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        {
          model: models.CustomerAddress,
          as: 'address',
        },
      ],
      where: { userId: userId },
    };

    const rta = await models.Customer.findOne(options).catch((error) =>
      boom.badRequest(error)
    );
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound('customer not found');
    }
    return user;
  }

  async create(data) {
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash,
      },
    };
    const newCustomer = await models.Customer.create(newData, {
      include: ['user'],
    });
    delete newCustomer.dataValues.user.dataValues.password;
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }
  async delete(id) {
    const model = await this.findOne(id).catch((error) =>
      boom.badRequest(error)
    );
    await model.destroy().catch((error) => boom.badRequest(error));
    return { id };
  }
}

module.exports = CustomerService;
