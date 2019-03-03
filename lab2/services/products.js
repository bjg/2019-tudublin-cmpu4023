const products = require('../models').products;
const getAll = () => products.findAll();
const getById = id => products.findById(id);
const add = products => products.create(products);
module.exports = {add, getAll, getById};