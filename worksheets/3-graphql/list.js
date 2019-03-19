const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {
  //const allCustomers = await prisma.customers()
  //console.log(allCustomers)
  //const allOrders = await prisma.orders()
  //console.log(allOrders)
  const prods = await prisma.products()
  console.log(prods)
  const cats = await prisma.categories()
  console.log(cats)
}

main().catch(e => console.error(e))
