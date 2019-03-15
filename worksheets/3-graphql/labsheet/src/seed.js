const { prisma } = require('./generated/prisma-client')

async function insertData() {

  // Create a new Customers and save to javaScript variable
  let customer1 = await prisma
    .createCustomer({
      firstname: "Ole Gunnar",
      lastname: "Solskjaer",
      address1: "3A Manchester Court",
      address2: "Sir Matt Busby Way",
      city: "Manchester",
      country: "United Kingdom",
      region: "Greater Manchester",
      email: "ogs@manutd.com",
      phone: "2020202020",
      username: "ogsolskjaer",
      password: "manutd",
      age: 46,
      income: 7500000,
      gender: "M",
    })

  let customer2 = await prisma
    .createCustomer({
      firstname: "Kendrick",
      lastname: "Lamar",
      address1: "80 Compton Street",
      city: "Compton",
      state: "California",
      zip: 90221,
      country: "USA",
      region: "Los Angeles",
      email: "kdotlamar@gmail.com",
      phone: "0987654321",
      username: "kdotlamar",
      password: "mAAdcity",
      age: 31,
      income: 50000000,
      gender: "M",
    })

  let customer3 = await prisma
    .createCustomer({
      firstname: "Theresa",
      lastname: "May",
      address1: "10 Downing Street",
      address2: "Westminister",
      city: "London",
      country: "United Kingdom",
      region: "Greater London",
      email: "tmay@mp.co.uk",
      phone: "6789012345",
      username: "tmay",
      password: "brexit",
      age: 62,
      income: 10000000,
      gender: "F",
    })

  let customer4 = await prisma
    .createCustomer({
      firstname: "Michael D.",
      lastname: "Higgins",
      address1: "Aras an Uachtarain",
      address2: "Phoenix Park",
      city: "Dublin",
      country: "Ireland",
      region: "Dublin",
      email: "miggildee@eircom.net",
      phone: "5432167890",
      username: "miggildee",
      password: "elpresidente",
      age: 77,
      income: 5000000,
      gender: "M",
    })

  // Read all Customers from the database and print them to the console
  const allCustomers = await prisma.customers()
  console.log("-----ALL CUSTOMERS-----\n")
  allCustomers.forEach(function(element) {
    console.log(element)
  })

  // Create new Products and save them to javaScript variables
  let product1 = await prisma
    .createProduct({
      name: "Nike Football",
      description: "Official Premier League Football",
      price: 19.99
    })

  let product2 = await prisma
    .createProduct({
      name: "Television",
      description: "Samsung 43Inch HDTV",
      price: 419.99
    })

  let product3 = await prisma
      .createProduct({
        name: "Book",
        description: "Lord of the Rings: Fellowship of the Ring",
        price: 12.99,
      })
  let product4 = await prisma
      .createProduct({
        name: "Laptop",
        description: "Dell 13.3 Inch Intel Core i7 8GB",
        price: 719.99
      })

  let product5 = await prisma
      .createProduct({
        name: "Pint",
        description: "Guinness",
        price: 5.20
      })

  let product6 = await prisma
      .createProduct({
        name: "Vinyl",
        description: "The Stone Roses",
        price: 39.99
      })

  let product7 = await prisma
      .createProduct({
        name: "Backpack",
        description: "Adidas Navy",
        price: 19.99
      })

  let product8 = await prisma
      .createProduct({
        name: "Leather Shoes",
        description: "Brown Brogue",
        price: 94.99
      })

  const allProducts = await prisma.products()
  console.log("-----ALL PRODUCTS-----\n")
  allProducts.forEach(function(element) {
    console.log(element)
  })

  // Creating new orders and saving to javaScript variable
  let order1 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer1.id
        }
      },
      net_amount: 885.04,
      tax: 65.25,
      total_amount: 819.79
    })

  let order2 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer2.id
        }
      },
      net_amount: 2439.95,
      tax: 100.04,
      total_amount: 2339.91
    })

  let order3 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer3.id
        }
      },
      net_amount: 122.95,
      tax: 11.02,
      total_amount: 111.93
    })

  let order4 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer4.id
        }
      },
      net_amount: 954.95,
      tax: 60.01,
      total_amount: 894.94
    })

  let order5 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer1.id
        }
      },
      net_amount: 411.15,
      tax: 32.27,
      total_amount: 378.88
    })

  let order6 = await prisma
    .createOrder({
      order_date: new Date(),
      customer: {
        connect: {
          id: customer3.id
        }
      },
      net_amount: 1756.85,
      tax: 156.89,
      total_amount: 1599.96
    })
  const allOrders = await prisma.orders()
  console.log("-----ALL ORDERS-----\n")
    allOrders.forEach(function(element) {
      console.log(element)
  })

  let orderLine1 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order1.id
        }
      },
      product: {
        connect: {
          id: product1.id
        }
      },
      quantity: 20
    })

  let orderLine2 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order1.id
        }
      },
      product: {
        connect: {
          id: product2.id
        }
      },
      quantity: 1
    })

  let orderLine3 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order2.id
        }
      },
      product: {
        connect: {
          id: product4.id
        }
      },
      quantity: 3
    })

  let orderLine4 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order2.id
        }
      },
      product: {
        connect: {
          id: product5.id
        }
      },
      quantity: 6
    })

  let orderLine5 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order3.id
        }
      },
      product: {
        connect: {
          id: product7.id
        }
      },
      quantity: 2
    })

  let orderLine6 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order3.id
        }
      },
      product: {
        connect: {
          id: product3.id
        }
      },
      quantity: 4
    })

  let orderLine7 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order3.id
        }
      },
      product: {
        connect: {
          id: product1.id
        }
      },
      quantity: 1
    })

  let orderLine8 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order4.id
        }
      },
      product: {
        connect: {
          id: product8.id
        }
      },
      quantity: 5
    })

  let orderLine9 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order4.id
        }
      },
      product: {
        connect: {
          id: product2.id
        }
      },
      quantity: 1
    })

  let orderLine10 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order5.id
        }
      },
      product: {
        connect: {
          id: product6.id
        }
      },
      quantity: 7
    })

  let orderLine11 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order5.id
        }
      },
      product: {
        connect: {
          id: product1.id
        }
      },
      quantity: 5
    })

  let orderLine12 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order6.id
        }
      },
      product: {
        connect: {
          id: product4.id
        }
      },
      quantity: 1
    })

  let orderLine13 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order6.id
        }
      },
      product: {
        connect: {
          id: product3.id
        }
      },
      quantity: 2
    })

  let orderLine14 = await prisma
    .createOrderLine({
      order: {
        connect: {
          id: order6.id
        }
      },
      product: {
        connect: {
          id: product6.id
        }
      },
      quantity: 1
    })
  const allOrderLines = await prisma.orderLines()
  console.log("-----ALL ORDERS LINES-----\n")
    allOrderLines.forEach(function(element) {
      console.log(element)
  })
}

insertData().catch(e => console.error(e))
