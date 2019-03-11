"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Category",
    embedded: false
  },
  {
    name: "Customer",
    embedded: false
  },
  {
    name: "Products",
    embedded: false
  },
  {
    name: "Orders",
    embedded: false
  },
  {
    name: "Cust_Hist",
    embedded: false
  },
  {
    name: "Inventory",
    embedded: false
  },
  {
    name: "Orderlines",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
