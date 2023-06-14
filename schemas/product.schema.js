const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(300);
const categoryName = Joi.string();
const price = Joi.number().optional();
const description = Joi.string().min(10);
const categoryIds = Joi.array().items(Joi.number().integer());
const promotionalPrice = Joi.number();
const stock = Joi.number().integer();

const status = Joi.boolean();
const price_min = Joi.number().optional();
const price_max = Joi.number().optional();
const page = Joi.number().integer().optional();
const pageSize = Joi.number().integer().optional();
const files = Joi.array();

const searchString = Joi.string();

const productVariant = Joi.array().items(
  Joi.object({
    name: Joi.string().min(3).max(15),
    price: Joi.number(),
    promotionalPrice,
    id: Joi.any(),
    stock: stock.optional(),
    status: status.optional(),
  })
);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  status: status.optional(),
  categoryIds: categoryIds.required(),
  productVariant: productVariant.optional(),
  promotionalPrice: promotionalPrice.optional(),
  stock: stock.optional(),
  files: files.optional(),
});

const updateProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  status: status.optional(),
  categoryIds: categoryIds.required(),
  productVariant: productVariant.optional(),
  promotionalPrice: promotionalPrice.optional(),
  stock: stock.optional(),
  files: files.optional(),
});

const getProductSchema = Joi.object({
  id: id.required(),
});

const queryProductSchema = Joi.object({
  page,
  pageSize,
  price,
  price_max: price_max.when('price_min', {
    is: price_min.required(),
    then: Joi.required(),
  })
});

const deleteProductSchema = Joi.object({
  idsDeleteArray: Joi.array(),
});

const getProductSchemaCategory = Joi.object({
  page,
  pageSize,
  categoryName,
});

const getProductSearchProduct = Joi.object({
  page,
  pageSize,
  searchString,
  categoryName,
  price_max: price_max.when('price_min', {
    is: price_min.required(),
    then: Joi.required(),
  })
});




const getProductSchemaSimilarProductsByCategory =
Joi.object({
  page,
  pageSize,
  Idcategory:id,
  idNot:id,
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  queryProductSchema,
  deleteProductSchema,
  getProductSchemaCategory,
  getProductSearchProduct,
  getProductSchemaSimilarProductsByCategory
};
