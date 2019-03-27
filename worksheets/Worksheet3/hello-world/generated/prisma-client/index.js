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
    name: "Products",
    embedded: false
  },
  {
    name: "Inventory",
    embedded: false
  },
  {
    name: "Orderlines",
    embedded: false
  },
  {
    name: "Order",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/c15469842-6f853f/hello-world/dev/_admin`
});
exports.prisma = new exports.Prisma();
