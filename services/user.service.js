const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const faker = require('faker');
const { Op } = require('sequelize');
const paginate = require('../utils/paginate');

const sequelize = require('../libs/sequelize');

const { models } = sequelize;
class UserService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash,
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find(data) {
    const options = {
      where: {
        [Op.not]: [{ role: 'Customer' }],
      },
    };
    const { page, pageSize } = data;
    const { limit, offset } = paginate(page, pageSize);
    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const users = await models.User.findAll(options);
    const count = await models.User.count();
    return { data: users, count };
  }

  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email },
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    delete user.dataValues.password;
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async updateWhitPasswordAdmin(id, changes) {
    const user = await this.findOne(id);
    const hash = await bcrypt.hash(changes.password, 10);
    const rta = await user.update({
      ...changes,
      password: hash,
    });
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
