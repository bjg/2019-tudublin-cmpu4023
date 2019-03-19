
import { prisma } from './generated/prisma-client'
import datamodelInfo from './generated/nexus-prisma'
import * as path from 'path'
import { stringArg, idArg } from 'nexus'
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma'
import { GraphQLServer } from 'graphql-yoga'



async function main(){


 const newProduct = await prisma
  .createProducts({
   cat_id: 1234,
   title: "dove", 
   actor: "cathal",
   price: 5.12, 
   special: 1
  })

console.log(`create new product: ${newProduct.title} (ID: ${newProduct.prod_id})`)

const allProds = await prisma.products()
console.log(allProds)
}

main().catch(e => console.error(e))
