const { prisma } = require('./generated/prisma-client')

// A `main` function so that we can use async/await
async function main() {

  // Create a new user called `Alice`
  const newCategory = await prisma.createCategory({ categoryname: 'Books' })

  // Read all users from the database and print them to the console
  const allCategories = await prisma.categories()
  console.log(allCategories)
}

main().catch(e => console.error(e))