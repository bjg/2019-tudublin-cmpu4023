Last part of the lab explanation:
## Introduction
For this lab I setup Prisma and Docker so that I could use it to interact with my Postgres database. Note that I added a number of resolvers and mutations just so I could add some test data. These can be ignored for the most part however for part 2 of the lab, one of these can be used.

### Part 1
The created GraphQL schema is located in the schema.graphql file and is called by graphql-yoga when the server is starting up. I designed it the way I imagined it would be represented using the ERD given.

### Part 2
As mentioned in the introduction, I have multiple resolvers that return information which are mostly just for testing purposes. These are:
**categories**: This is for this part, it will return categories and the any attributes from the categories table that are desired.
**products**: Created for testing but returns products.
**orderLines**: Created for testing but returns products.
**orders**: Created for testing but returns products.
**customers**: This is for part 3.

### Part 3
For part 3 I created a customers resolver that will allow for the user to return all of the customers and for each customer their orders and for each order their respective order lines. This is defined in the query object of resolvers but is then extended so nesting could occur.

The **Customer** object takes the orders for each customer and uses the parent ID (i.e the customers ID) as a filter in order to get the orders only associated with each customer.

The **Order** object then takes for each order the orderLines and applies a more complex filter. This where statement will basically take the parent ID of the order and make it so that only order lines for each order are returned.

To highlight this, the following GraphQL query can be used to return the data.

```graphql
query {
  customers {
    id
    firstName
    lastName
    username
    creditCard
    orders {
      id
      netAmount
      orderDate
      orderLines {
        id
        quantity
        orderDate
      }
    }
  }
}
```

![alt text](https://raw.githubusercontent.com/mark-barrett/2019-tudublin-cmpu4023/C15409432-wks-3/worksheets/3-graphql/part3-query.png)

### Part 4:
The task for this was to create a mutation that would add to one and update or add to another table. For this my proposed mutation will create an OrderLine and it will link it to a particular product. It will then also create an order for that order line and it will also link that order to a particular customer.

**Example:**
An application for this query would be for generating a new order for a customer
by a billing application. If there is not current order, create an order line which will handle taking care of the first order line and also the order itself. If there are already order lines present, then the billing application could just update by adding another but by just linking it to the particular order.

**Example GraphQL query to create this above:**

```graphql
mutation {
  createOrderLine(
    quantity:1,
    orderDate:"2019-03-07"
    product:"cjsxfyzfu001k0892og289md3"
    order: {
      orderDate:"2019-03-07"
      netAmount:100.00
      tax:23.00
      totalAmount:123.00
      customer:"cjsxgw4xs00270892k73bewmn"
    }
  ){
    id
  }
}
```

![alt text](https://raw.githubusercontent.com/mark-barrett/2019-tudublin-cmpu4023/C15409432-wks-3/worksheets/3-graphql/part4-mutation.png)