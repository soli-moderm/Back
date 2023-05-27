const paginate = (page, pageSize) => {

  
  const offset = Number(page) * Number(pageSize);


  const limit = Number(pageSize);

  return {
    offset,
    limit,
  };
};

module.exports = paginate;
