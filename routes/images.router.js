const express = require('express');

const ImagesService = require('./../services/images.service');
const boom = require('@hapi/boom');

const router = express.Router();
const service = new ImagesService();
const { uploadFile, getFileStream, getBuckets } = require('../utils/s3');
const upload = require('../utils/multer');

router.get('/:key', (req, res) => {
  console.log(
    '🚀 ~ file: images.router.js ~ line 13 ~ router.get ~ req.params',
    req.params
  );
  const key = req.params.key;
  if (key && key !== 'undefined') {
    const readStream = getFileStream(key);
    readStream.pipe(res);
  } else {
    throw boom.badRequest('invalid image');
  }
});

router.post('/uploadImages', upload.array('files'), async (req, res, next) => {
  const files = req.files;
  console.log(
    '🚀 ~ file: images.router.js ~ line 24 ~ router.post ~ files',
    files
  );
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

module.exports = router;
