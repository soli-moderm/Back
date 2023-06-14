const faker = require('faker');
const { Op } = require('sequelize');
const boom = require('@hapi/boom');
const { uploadFile, getFileStream, getBuckets } = require('../utils/s3');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const { models } = require('../libs/sequelize');
const paginate = require('../utils/paginate');
const { options } = require('joi');

class ProductsService {
  async create(body) {
    const {
      status = true,
      name,
      description,
      price,
      categoryIds,
      productVariant = [],
      promotionalPrice = 0,
      stock = null,
      files = [],
    } = body;

    //create Product

    const newProduct = await models.Product.create({
      name,
      description,
      price,
      status,
      promotionalPrice,
      stock,
    });

    if (productVariant) {
      productVariant.forEach(async (variant) => {
        const { name, price, promotionalPrice = 0, stock = null } = variant;
        try {
          await models.Product_variant.create({
            name,
            price,
            productId: newProduct.id,
            stock,
            promotionalPrice,
            status: true,
          });
        } catch (error) {
          return boom.badRequest(error);
        }
      });
    }

    categoryIds.forEach(async (id) => {
      try {
        await models.CategoryProduct.create({
          categoryId: id,
          productId: newProduct.id,
        });
      } catch (error) {
        return boom.badRequest(error);
      }
    });
    if (files) {
      const results = await Promise.all(
        files.map(async (file) => {
          try {
            await models.Product_images.create({
              filename: file,
              productId: newProduct.id,
            });
          } catch (error) {
            return boom.badRequest(error);
          }
        })
      );
    }

    return newProduct;
  }

  async find(query) {
    const options = {
      include: ['category', 'product_images', 'product_variant'],
    };

    const { page, pageSize } = query;

    const { limit, offset } = paginate(page, pageSize);

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }
 const { price } = query;
    if (price) {
      options.where.price = price;
    }
    const { price_min, price_max } = query;
    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }

    console.log(
      '🚀 ~ file: products.service.js ~ line 122 ~ ProductsService ~ find ~ optionns',
      options
    );
    const products = await models.Product.findAll(options);

    const count = await models.Product.count();

    return { data: products, count };
  }

  async findOne(id) {
    const options = {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id'],
        },
        {
          model: models.Product_images,
          as: 'product_images',
          attributes: ['filename'],
        },
        {
          model: models.Product_variant,
          as: 'product_variant',
          attributes: [
            'id',
            'name',
            'price',
            'promotionalPrice',
            'stock',
            'status',
          ],
        },
      ],
      where: {
        id: id,
      },
    };
    const product = await models.Product.findOne(options);
    if (!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async update(id, body) {
    let Product = {};

    const {
      status = true,
      name,
      description,
      price,
      categoryIds,
      productVariant = [],
      promotionalPrice = 0,
      stock = null,
      files = [],
    } = body;

    try {
      const product = await models.Product.findByPk(id);

      if (!product) {
        throw boom.notFound('product not found');
      }
      Product = await product.update({
        name,
        description,
        price,
        status,
        promotionalPrice,
        stock,
      });
    } catch (error) {
      return boom.badRequest(error);
    }
    if (files) {
      try {
        const fileInDataBase = await models.Product_images.findAll({
          where: { product_id: id },
        });

        const filenameInDataBase = fileInDataBase.map((file) => file.filename);

        const newFilesfilter = files.filter(
          (file) => !filenameInDataBase.includes(file)
        );

        const newFiles = newFilesfilter.map((file) => {
          return {
            filename: file,
            productId: id,
          };
        });

        const filesToRemove = fileInDataBase
          .filter(({ filename }) => !files.includes(filename))
          .map(({ id }) => id);

        if (filesToRemove.length > 0) {
          await models.Product_images.destroy({
            where: { id: filesToRemove },
          });
        }

        if (newFiles.length > 0) {
          await models.Product_images.bulkCreate(newFiles);
        }
      } catch (error) {
        return boom.badRequest(error);
      }
    }

    if (productVariant) {
      try {
        const productVariantDataBase = await models.Product_variant.findAll({
          where: { product_id: id },
        });

        const productVariantDataBaseName = productVariantDataBase.map(
          (variant) => variant.name
        );

        const productVariantArray = productVariant.map(({ name }) => name);

        const variantToRemove = productVariantDataBase
          .filter(({ name }) => !productVariantArray.includes(name))
          .map(({ id }) => id);

        const newVariant = productVariant
          .filter(
            (variant) => !productVariantDataBaseName.includes(variant.name)
          )
          .map(({ name, price, stock, promotionalPrice }) => {
            return {
              productId: id,
              name,
              price,
              stock,
              promotionalPrice,
              status: true,
            };
          });

        const updateVariant = productVariant
          .filter((variant) =>
            productVariantDataBaseName.includes(variant.name)
          )
          .map(
            ({
              id: variantId,
              name,
              price,
              stock,
              promotionalPrice,
              status,
            }) => {
              return {
                id: variantId,
                productId: id,
                name,
                price,
                stock,
                promotionalPrice,
                status,
              };
            }
          );

        if (updateVariant.length > 0) {
          await models.Product_variant.bulkCreate(updateVariant, {
            updateOnDuplicate: ['name', 'price'],
          });
        }

        if (variantToRemove.length > 0) {
          await models.Product_variant.destroy({
            where: { id: variantToRemove },
          });
        }

        if (newVariant.length > 0) {
          await models.Product_variant.bulkCreate(newVariant);
        }
      } catch (error) {
        return boom.badRequest(error);
      }
    }

    if (categoryIds) {
      try {
        const categorysProductDataBase = await models.CategoryProduct.findAll({
          where: { product_id: id },
        });
        const categorysProductDataBaseIds = categorysProductDataBase.map(
          (category) => category.categoryId
        );
        const newCategory = categoryIds
          .filter((category) => !categorysProductDataBaseIds.includes(category))
          .map((category_id) => {
            return { categoryId: category_id, productId: id };
          });

        const categorysToRemove = categorysProductDataBase
          .filter(({ categoryId }) => !categoryIds.includes(categoryId))
          .map(({ id }) => id);

        if (categorysToRemove.length > 0) {
          await models.CategoryProduct.destroy({
            where: { id: categorysToRemove },
          });
        }

        if (newCategory.length > 0) {
          await models.CategoryProduct.bulkCreate(newCategory);
        }
      } catch (error) {
        return boom.badRequest(error);
      }
    }

    return Product;
  }

  async delete(id) {
    const product = await this.findOne(id);
    if (!product) {
      throw boom.notFound('user not found');
    }
    await product.destroy();
    return { id };
  }

  async deleteArray(body) {
    const { idsDeleteArray } = body;

    if (idsDeleteArray) {
      try {
        await models.Product.destroy({ where: { id: idsDeleteArray } });
      } catch (error) {
        return boom.badRequest(error.message);
      }
    }
    return idsDeleteArray;
  }

  async uploadImages({ files }) {
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
    const idImages = results.map((image) => key);
    console.log(
      '🚀 ~ file: products.service.js ~ line 119 ~ ProductsService ~ uploadImages ~ idImages',
      idImages
    );
    console.log(
      '🚀 ~ file: products.router.js ~ line 90 ~ results ~ results',
      results
    );

    return results;
  }

  async getByCategory(query, categoryName) {
    const { page, pageSize } = query;

    const options = {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id'],
          where: { name: categoryName },
        },
        {
          model: models.Product_images,
          as: 'product_images',
          attributes: ['filename'],
        },
        {
          model: models.Product_variant,
          as: 'product_variant',
          attributes: [
            'id',
            'name',
            'price',
            'promotionalPrice',
            'stock',
            'status',
          ],
        },
      ],
    };

    const { limit, offset } = paginate(page, pageSize);

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const products = await models.Product.findAll(options);

    const count = await models.Product.count();

    return { data: products, count };
  }

  async getSimilarProductsByCategory(query, Idcategory) {
    console.log(
      '🚀 ~ file: products.service.js ~ line 441 ~ ProductsService ~ getSimilarProductsByCategory ~ Idcategory',
      Idcategory
    );

    const { page, pageSize, idNot } = query;

    const options = {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id'],
          where: { id: Number(Idcategory) },
        },
        {
          model: models.Product_images,
          as: 'product_images',
          attributes: ['filename'],
        },
        {
          model: models.Product_variant,
          as: 'product_variant',
          attributes: [
            'id',
            'name',
            'price',
            'promotionalPrice',
            'stock',
            'status',
          ],
        },
      ],
      where: {
        [Op.not]: [{ id: idNot }],
      },
    };

    const { limit, offset } = paginate(page, pageSize);

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const products = await models.Product.findAll(options);

    const count = await models.Product.count();

    return { data: products, count };
  }

  async searchProduct(query, searchString) {
    console.log(
      '🚀 ~ file: products.service.js ~ line 495 ~ ProductsService ~ searchProduct ~ searchString',
      searchString
    );

    const optionsCategory = query?.categoryName
      ? { name: query?.categoryName }
      : {};
    console.log(
      '🚀 ~ file: products.service.js ~ line 498 ~ ProductsService ~ searchProduct ~ optionsCategory',
      optionsCategory
    );

    const options = {
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name'],
          where: optionsCategory,
        },
        {
          model: models.Product_images,
          as: 'product_images',
          attributes: ['filename'],
        },
        {
          model: models.Product_variant,
          as: 'product_variant',
          attributes: [
            'id',
            'name',
            'price',
            'promotionalPrice',
            'stock',
            'status',
          ],
        },
      ],
      where: {
        name: { [Op.iLike]: `%${searchString}%` },
      },
    };

    const optionsCategoryInSearch = {
      attributes: ['id'],
      include: [
        {
          model: models.Category,
          as: 'category',
          attributes: ['id', 'name'],
          where: optionsCategory,
        },
      ],
      where: {
        name: { [Op.iLike]: `%${searchString}%` },
      },
    };

    const { price_min, price_max } = query;
    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
      optionsCategoryInSearch.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }
    const { page, pageSize } = query;
    const { limit, offset } = paginate(page, pageSize);

    if (page && pageSize) {
      options.limit = limit;
      options.offset = offset;
    }

    const products = await models.Product.findAll(options);

    const categoryInSearchData = await models.Product.findAll(
      optionsCategoryInSearch
    );

    const categoryInProducts = categoryInSearchData.reduce(
      (previous, current) => {
        const arrayCurrent = current.category.map((item) => {
          return { name: item.name, id: item.id };
        });
        return [...previous, ...arrayCurrent];
      },
      []
    );

    //eliminar objetos repetidos
    let hash = {};
    const categoryInSearch = categoryInProducts.filter((o) => {
      return hash[o.id] ? false : (hash[o.id] = true);
    });

    const count = await models.Product.count();

    return { data: products, count, categoryInSearch };
  }
}

module.exports = ProductsService;
