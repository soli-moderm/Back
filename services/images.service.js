const faker = require('faker');
const { Op } = require('sequelize');
const boom = require('@hapi/boom');
const { uploadFile, getFileStream, getBuckets } = require('../utils/s3');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

class ImagesService {
  async uploadImages({ files }) {
    console.log(
      '🚀 ~ file: images.service.js ~ line 20 ~ ImagesService ~ uploadImages ~ files',
      files
    );

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
    console.log(
      '🚀 ~ file: products.service.js ~ line 119 ~ ImagesService ~ uploadImages ~ idImages',
      idImages
    );
    console.log(
      '🚀 ~ file: products.router.js ~ line 90 ~ results ~ results',
      results
    );

    return results;
  }
}

module.exports = ImagesService;
