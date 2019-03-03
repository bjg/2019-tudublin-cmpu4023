const Products = require('../models').Product;
const getAll = () => Products.findAll();
const getById = id => Products.findById(id);
const add = product => Products.create(product);
module.exports = {add, getAll, getById};