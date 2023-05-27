const { config } = require('../../config/config');
const fs = require('fs');

const AWS = require('aws-sdk');

const bucketName = config.bucketName_s3;

const paramConfig = {
  region: config.region_s3,
  accessKeyId: config.accessKeyId_s3,
  secretAccessKey: config.secretAccessKey_s3,
};

const s3 = new AWS.S3({
  ...paramConfig,
  s3BucketEndpoint: false,
  endpoint: 'https://s3.amazonaws.com',
});

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.originalname,
  };
  return s3.upload(uploadParams).promise();
}

const getBuckets = () => {
  return s3.listBuckets().promise();
};

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

getFileStream;

module.exports = { getFileStream, uploadFile, getBuckets };
