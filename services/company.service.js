const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');


class CompanyService {
  constructor() {}

    async create(body) {
    const newCompany = await models.Company.create({
      name: body.name,
      CompanyName: body.CompanyName,
      zipCode: body.zipCode,
      state: body.state,
      municipality: body.municipality,
      colony: body.colony,
      street: body.street,
      outdoorNumber: body.outdoorNumber,
      interiorNumber: body.interiorNumber,
    });
    return newCompany;
    }

    async find(data) {
    const options = {
      where: {},
    };
    const { page, pageSize } = data;
    const { limit, offset } = paginate(page, pageSize);
    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const companies = await models.Company.findAll(options);
    const count = await models.Company.count();
    return { data: companies, count };
    }

    async findOne(id) {
    const company = await models.Company.findByPk(id);
    return company;
    }

    async update(id, { body }) {
    const company = await this.findOne(id);
    if (!company) {
      throw boom.notFound('Company not found');
    }
    const updatedCompany = await company.update({
      name: body.name,
      CompanyName: body.CompanyName,
      zipCode: body.zipCode,
      state: body.state,
      municipality: body.municipality,
      colony: body.colony,
      street: body.street,
      outdoorNumber: body.outdoorNumber,
      interiorNumber: body.interiorNumber,
    });
    return updatedCompany;
    }

    async delete(id) {
    const company = await this.findOne(id);
    if (!company) {
      throw boom.notFound('Company not found');
    }
    await company.destroy();
    return { id };
    }
}

module.exports = CompanyService;

