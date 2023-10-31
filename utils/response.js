const sedResponseSuccess = (res, statusCode = '201', message, data) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

module.exports = sedResponseSuccess;
