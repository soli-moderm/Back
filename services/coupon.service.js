const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { typeStatusCoupon } = require('../utils/typeStatus');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class CouponService {
  constructor() {}

  async find(query) {
    const { page, pageSize, searchString } = query;

    const options = {
      where: searchString
        ? {
            name: { [Op.iLike]: `%${searchString}%` },
            status: {
              [Op.ne]: typeStatusCoupon.DELETE,
            },
          }
        : {
            status: {
              [Op.ne]: typeStatusCoupon.DELETE,
            },
          },
    };

    if (page && pageSize) {
      options.limit = pageSize;
      options.offset = page * pageSize;
    }

    const rta = await models.Coupon.findAndCountAll(options).catch((error) =>
      boom.badRequest(error)
    );
    return rta;
  }

  async findOne(id) {
    const coupon = await models.Coupon.findByPk(id);
    if (!coupon) {
      throw boom.notFound('Coupon not found');
    }
    return coupon;
  }

  async create(data) {
    const coupon = {
      ...data,
      status: typeStatusCoupon.ACTIVO,
    };
    const newCoupon = await models.Coupon.create(coupon).catch((error) => {
      console.log(
        '🚀 ~ file: coupon.service.js:41 ~ CouponService ~ create ~ error:',
        error
      );
      return boom.badRequest(error);
    });
    console.log(
      '🚀 ~ file: coupon.service.js:43 ~ CouponService ~ create ~ newCoupon:',
      newCoupon
    );
    return newCoupon;
  }

  async update(id, changes) {
    const coupon = await this.findOne(id).catch((error) =>
      boom.badRequest(error)
    );
    const rta = await coupon.update(changes);
    return rta;
  }

  async delete(id) {
    const coupon = await this.findOne(id).catch((error) =>
      boom.badRequest(error)
    );
    await coupon.update({ status: typeStatusCoupon.DELETE });
    return { id };
  }
}




module.exports = CouponService;
