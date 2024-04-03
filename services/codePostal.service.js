const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class CodePostalService {
  constructor() {}

  async find(query) {
    const { codePostal } = query;
    const options = {
      where: {
        zipCode: codePostal,
      },
    };
    const codePostals = await models.PostalCode.findAll(options).catch(
      (error) => boom.badRequest(error)
    );
    console.log('🚀 ~ CodePostalService ~ find ~ codePostals:', codePostals);
    if (!codePostals || codePostals.length === 0) {
      throw boom.notFound('Code Postal not found');
    }
    const count = await models.PostalCode.count();
    return { codePostals: codePostals, count };
  }

  async findOne(id) {
    const codePostal = await models.PostalCode.findByPk(id);
    return codePostal;
  }
}

module.exports = CodePostalService;
