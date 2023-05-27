const express = require('express');

const ProductsService = require('./../services/products.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  queryProductSchema,
  deleteProductSchema,
  getProductSchemaCategory,
  getProductSearchProduct,
  getProductSchemaSimilarProductsByCategory
} = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductsService();
const { uploadFile, getFileStream, getBuckets } = require('../utils/s3');
const upload = require('../utils/multer');

router.get(
  '/',
  validatorHandler(queryProductSchema, 'query'),
  async (req, res, next) => {
    try {
      const products = await service.find(req.query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/category/:categoryName',
  validatorHandler(getProductSchemaCategory, 'params'),
  async (req, res, next) => {
    const { categoryName }=req.params;
    try {
      const product = await service.getByCategory(req.query, categoryName);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/similarProductsByCategory/:Idcategory',
  validatorHandler(getProductSchemaSimilarProductsByCategory, 'params'),
  async (req, res, next) => {
    const { Idcategory }=req.params;
    try {
      const product = await service.getSimilarProductsByCategory(req.query, Idcategory);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/searchProduct/:searchString',
  validatorHandler(getProductSearchProduct, 'params'),
  async (req, res, next) => {
    const { searchString }=req.params;
    try {
      const product = await service.searchProduct(req.query, searchString);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  '/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProduct = await service.create(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/images/:key', (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.post('/uploadImages', upload.array('image'), async (req, res, next) => {
  const files = req.files;
  try {
    const resp = await service.uploadImages({ files });
    res.status(201).send({
      status: 'success',
      message: 'Files uploaded successfully',
      data: req.files,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  '/deleteProducts',
  validatorHandler(deleteProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      console.log('🚀 ~ file: products.router.js ~ line 115 ~ body', body);
      const arrayDelete = await service.deleteArray(body);
      res.status(201).send({
        status: 'success',
        message: 'Delete Products Success',
        data: arrayDelete,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
