# Lab 3: GraphQL

The implementation for the resolvers can be found in [index.js](index.js).

The database was initialised with the dummy data in [db-init.js](db-init.js) before running the queries below.

## Tutorial Code

The tutorial code can be found in the [tutorial-code](tutorial-code) directory.

## Part 1: Relationships

For this lab, I have implemented the relationships between orders, orderlines, products and categories.

The implementation for this can be found in [datamodel.prisma](datamodel.prisma).

## Part 2: Query resolver

I implemented a simple query resolver, productsByCategory(), that returns all products for a specifed category.

Example query that returns all products in the fruit category:

```
query {
  productsByCategory(categoryName: "fruit") {
    title
    price
  }
}
```

Resultant output:

```
{
  "data": {
    "productsByCategory": [
      {
        "title": "apple",
        "price": 1
      },
      {
        "title": "pear",
        "price": 2
      }
    ]
  }
}
```

## Part 3: Complex query resolver

For this, I implemented a resolver, ordersForCategory(), that can display the amount spent in each order that contains at least one product from a specific category.

Example query, this time for the drinks category:

```
query {
  ordersForCategory(categoryName:"drinks") {
    name
    products {
      title
      orderlines {
        quantity
        order {
          id
          amount
        }
      }
    }
  }
}
```

Resultant output:

```
{
  "data": {
    "ordersForCategory": {
      "name": "drinks",
      "products": [
        {
          "title": "coke",
          "orderlines": [
            {
              "quantity": 1,
              "order": {
                "id": "cjtg8nsam00r20799n0981lmi",
                "amount": 9.5
              }
            },
            {
              "quantity": 1,
              "order": {
                "id": "cjtg8nsbx00r70799wk865uun",
                "amount": 5.5
              }
            }
          ]
        },
        {
          "title": "pepsi",
          "orderlines": [
            {
              "quantity": 2,
              "order": {
                "id": "cjtg8nsbx00r70799wk865uun",
                "amount": 5.5
              }
            }
          ]
        }
      ]
    }
  }
}
```

## Part 4: Mutation resolver

I implemented a mutation resolver, createProductWithNewCategory(), which accepts product and category details. It creates a new product, and if the category does not exist it creates it and links them together. If the category does exist, it simply links the existing category to the new product.

Example mutation:

```
mutation {
  createProductWithCategory(title:"ketchup", price: 1.23, categoryName: "sauce") {
    id
    title
    price
    category {
      id
      name
    }
  }
}
```

Resultant output:

```
{
  "data": {
    "createProductWithCategory": {
      "id": "cjtgaoaqf00vp0799coip2v5l",
      "title": "ketchup",
      "price": 1.23,
      "category": {
        "id": "cjtgal8w600up0799n1vxf0ef",
        "name": "sauce"
      }
    }
  }
}
```

## Part 5

The output show in each section above is from running the queries using the graphql-yoga web interface. These can be further demonstrated in the lab.

