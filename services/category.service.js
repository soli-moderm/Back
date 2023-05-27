const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');
const { uploadFile } = require('../utils/s3');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const paginate = require('../utils/paginate');

class CategoryService {
  constructor() {}

  async create(body) {
    const newCategory = await models.Category.create({
      name: body.name,
      image: body.file,
    });
    return newCategory;
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

    const categories = await models.Category.findAll(options);
    const count = await models.Category.count();
    return { data: categories, count };
  }

  async allList() {
    const categories = await models.Category.findAll();
    const count = await models.Category.count();
    return { data: categories, count };
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'],
    });
    return category;
  }

  async update(id, { body, files }) {
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await uploadFile(file);
          await unlinkFile(file.path);
          return result;
        } catch (error) {
          return error;
        }
      })
    );

    const idImages = results.map((image) => image.key);

    const category = await models.Category.findByPk(id);

    const rta = await category.update({
      name: body.name,
      image: idImages[0],
    });

    return rta;
  }

  async delete(id) {
    const category = await models.Category.findByPk(Number(id));
    await category.destroy();
    return { id };
  }
}

module.exports = CategoryService;
