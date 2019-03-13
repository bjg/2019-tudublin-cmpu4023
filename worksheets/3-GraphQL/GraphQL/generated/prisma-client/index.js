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
    name: "Product",
    embedded: false
  },
  {
    name: "Inventory",
    embedded: false
  },
  {
    name: "Orderline",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  },
  {
    name: "Customer",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://192.168.99.100:4466`
});
exports.prisma = new exports.Prisma();
