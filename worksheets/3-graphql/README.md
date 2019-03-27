###creating category
mutation{
  createCategory(category:1, categoryname:"Phone") {
    category
    categoryname
  }
}


###Create product
mutation {
  createProduct(
    prod_id: 1,
    title: "iPhone",
    actor:"blabla",
    price: 23.44,
    categoryId: 1) {
    title
    category{
      category
      categoryname
    }
  }
}


###create inventory
mutation{
  createInventory(sales: 0, quan_in_stock: 20, prod_id:1){
    sales
    quan_in_stock
    product {
      title
      price
      category {
        category
        categoryname
      }
    }
  }
}

###Create order for product, if there is enough available in stock.
###Users can order multiple quantities of the same item.
###If order is successful the sales and quan_in_stock fields will be updated for the inventory of that product
###and the order will then be placed in orderline table.
mutation {
  createOrderline(
    orderlineid: 112,
    quantity: 1,
    prod_id: 1) {
    orderdate
    product {
      title
      price
      category{
        categoryname
      }
    }
  }
}



###get categories
query{
  getCategories{
    category
    categoryname
  }
}

###get products
query{
  getProducts {
    prod_id
    title
    actor
    price
    category {
      category
      categoryname
    }
  }
}

###get inventories
### 3 levels are inventory, product and category
### query allows for user to get inventories available for each product along with the category that product belongs to
query {
  getInventories{
    quan_in_stock
    sales
    product{
      prod_id
      title
      price
      category {
        categoryname
      }
    }
  }
}

#get order dates
query{
  getOrderlines {
    orderlineid
    product{
      prod_id
      title
    }
    quantity
    orderdate
  }
}