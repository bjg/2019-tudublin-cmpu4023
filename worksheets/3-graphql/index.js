const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    productsForCategory(root, args, context){
        return context.prisma.products({
            where: { category: { name: args.categoryName } } 
        })
    },
    category(root, args, context){
        return context.prisma.category({
            id: args.categoryId
        })
    },
    product(root, args, context){
        return context.prisma.product({
            id: args.productId
        })
    },
    inventory(root, args, context){
        return context.prisma.inventory({
            where: { product: { id: args.productId } }
        })
    },
    allCategories(root, args, context){
        return context.prisma.categories();
    },
    allProducts(root, args, context){
        return context.prisma.products();
    },
    /* Not working */
    totalInventoryValueForCategory(root, args, context){
        const category = context.prisma.categories({ where : { id: args.categoryId} })
        const productList = context.prisma.products({ where: { category: { id: category.id } }})
        
        if(productList == null)
            return 0;
        
        if(! (productList instanceof Array))
        {
            const inventoryStock = context.prisma.inventory({where: { product: {id: productList.id} }}).quan_in_stock;
            return  productList.price * inventoryStock;
        }
        
        const value = 0;
        
        for(let prod of productList){
            const inventoryStock = context.prisma.inventory({where: { product: {id: prod.id} }}).quan_in_stock;
            value += prod.price * inventoryStock;
        }
        
        return value;
    }
  },
  Mutation: {
    createCategory(root, args, context) {
        return context.prisma.createCategory(
            { name: args.name },
        )
    },
    createProduct(root, args, context){
        return context.prisma.createProduct({
            title: args.title,
            category: {
                connect: { id: args.categoryId }
            },
            price: args.price,
            actor: args.actor,
            special: args.special
        },
        )
    },
    createInventory(root, args, context){
        return context.prisma.createInventory({
            product: {
                connect: { id: args.productId }
            },
            quan_in_stock: args.quantityInStock,
            sales: args.sales
        })
    },
    addProductWithInventory(root, args, context){
        const newProduct = context.prisma.createProduct({
            title: args.title,
            category: {
                connect: { id: args.categoryId }
            },
            price: args.price,
            actor: args.actor,
            special: args.special
        });
        
        const inventory = context.prisma.createInventory({
            product: {
                connect: { id: newProduct.id }
            },
            quan_in_stock: args.quantityInStock,
            sales: 0
        });
        
        return newProduct;
    }
  },
  Product: {
    category(root, args, context) {
        return context.prisma.product({
            id: root.id
        }).category()
    }
  },
  Inventory: {
    product(root, args, context) {
        return context.prisma.inventory({
            where: { product: { id: root.id } }
        }).product()
    }
  }
  
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
