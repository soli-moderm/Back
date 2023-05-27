require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
  bucketName_s3: process.env.AWS_BUCKET_NAME,
  region_s3: process.env.AWS_BUCKET_REGION,
  accessKeyId_s3: process.env.AWS_ACCESS_KEY,
  secretAccessKey_s3: process.env.AWS_SECRET_KEY,
  conecktaStagingPrivateKey: process.env.CONEKTA_STAGING_PRIVATEKEY,
  stripePrivateKey: process.env.STRIPE_PRIVATE_KEY,
};

module.exports = { config };
