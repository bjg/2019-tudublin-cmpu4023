Add any additional documentation here...

Part 3 Query:
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

Part 4 Query:
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