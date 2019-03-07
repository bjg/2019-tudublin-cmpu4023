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
      orderLines {
        id
        quantity
        orderDate
      }
    }
  }
}