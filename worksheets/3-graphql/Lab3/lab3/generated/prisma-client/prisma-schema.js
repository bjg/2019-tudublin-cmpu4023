module.exports = {
        typeDefs: // Code generated by Prisma (prisma@1.28.5). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

/* GraphQL */ `type AggregateCategory {
  count: Int!
}

type AggregateCustomer {
  count: Int!
}

type AggregateOrder {
  count: Int!
}

type AggregateOrderline {
  count: Int!
}

type AggregateProduct {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Category {
  id: ID!
  categoryname: String!
}

type CategoryConnection {
  pageInfo: PageInfo!
  edges: [CategoryEdge]!
  aggregate: AggregateCategory!
}

input CategoryCreateInput {
  id: ID!
  categoryname: String!
}

input CategoryCreateOneInput {
  create: CategoryCreateInput
  connect: CategoryWhereUniqueInput
}

type CategoryEdge {
  node: Category!
  cursor: String!
}

enum CategoryOrderByInput {
  id_ASC
  id_DESC
  categoryname_ASC
  categoryname_DESC
}

type CategoryPreviousValues {
  id: ID!
  categoryname: String!
}

type CategorySubscriptionPayload {
  mutation: MutationType!
  node: Category
  updatedFields: [String!]
  previousValues: CategoryPreviousValues
}

input CategorySubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CategoryWhereInput
  AND: [CategorySubscriptionWhereInput!]
}

input CategoryUpdateDataInput {
  id: ID
  categoryname: String
}

input CategoryUpdateInput {
  id: ID
  categoryname: String
}

input CategoryUpdateManyMutationInput {
  id: ID
  categoryname: String
}

input CategoryUpdateOneInput {
  create: CategoryCreateInput
  update: CategoryUpdateDataInput
  upsert: CategoryUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: CategoryWhereUniqueInput
}

input CategoryUpsertNestedInput {
  update: CategoryUpdateDataInput!
  create: CategoryCreateInput!
}

input CategoryWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  categoryname: String
  categoryname_not: String
  categoryname_in: [String!]
  categoryname_not_in: [String!]
  categoryname_lt: String
  categoryname_lte: String
  categoryname_gt: String
  categoryname_gte: String
  categoryname_contains: String
  categoryname_not_contains: String
  categoryname_starts_with: String
  categoryname_not_starts_with: String
  categoryname_ends_with: String
  categoryname_not_ends_with: String
  AND: [CategoryWhereInput!]
}

input CategoryWhereUniqueInput {
  id: ID
}

type Customer {
  id: ID!
  firstname: String!
  lastname: String!
  address1: String!
  address2: String!
  city: String!
  state: String!
  zip: String!
  country: String!
  region: String!
  email: String!
  phone: String!
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String!
  password: String!
  age: Int!
  income: Float
  gender: String!
}

type CustomerConnection {
  pageInfo: PageInfo!
  edges: [CustomerEdge]!
  aggregate: AggregateCustomer!
}

input CustomerCreateInput {
  id: ID!
  firstname: String!
  lastname: String!
  address1: String!
  address2: String!
  city: String!
  state: String!
  zip: String!
  country: String!
  region: String!
  email: String!
  phone: String!
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String!
  password: String!
  age: Int!
  income: Float
  gender: String!
}

input CustomerCreateOneInput {
  create: CustomerCreateInput
  connect: CustomerWhereUniqueInput
}

type CustomerEdge {
  node: Customer!
  cursor: String!
}

enum CustomerOrderByInput {
  id_ASC
  id_DESC
  firstname_ASC
  firstname_DESC
  lastname_ASC
  lastname_DESC
  address1_ASC
  address1_DESC
  address2_ASC
  address2_DESC
  city_ASC
  city_DESC
  state_ASC
  state_DESC
  zip_ASC
  zip_DESC
  country_ASC
  country_DESC
  region_ASC
  region_DESC
  email_ASC
  email_DESC
  phone_ASC
  phone_DESC
  creditcardtype_ASC
  creditcardtype_DESC
  creditcard_ASC
  creditcard_DESC
  creditcardexpiration_ASC
  creditcardexpiration_DESC
  username_ASC
  username_DESC
  password_ASC
  password_DESC
  age_ASC
  age_DESC
  income_ASC
  income_DESC
  gender_ASC
  gender_DESC
}

type CustomerPreviousValues {
  id: ID!
  firstname: String!
  lastname: String!
  address1: String!
  address2: String!
  city: String!
  state: String!
  zip: String!
  country: String!
  region: String!
  email: String!
  phone: String!
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String!
  password: String!
  age: Int!
  income: Float
  gender: String!
}

type CustomerSubscriptionPayload {
  mutation: MutationType!
  node: Customer
  updatedFields: [String!]
  previousValues: CustomerPreviousValues
}

input CustomerSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: CustomerWhereInput
  AND: [CustomerSubscriptionWhereInput!]
}

input CustomerUpdateDataInput {
  id: ID
  firstname: String
  lastname: String
  address1: String
  address2: String
  city: String
  state: String
  zip: String
  country: String
  region: String
  email: String
  phone: String
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String
  password: String
  age: Int
  income: Float
  gender: String
}

input CustomerUpdateInput {
  id: ID
  firstname: String
  lastname: String
  address1: String
  address2: String
  city: String
  state: String
  zip: String
  country: String
  region: String
  email: String
  phone: String
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String
  password: String
  age: Int
  income: Float
  gender: String
}

input CustomerUpdateManyMutationInput {
  id: ID
  firstname: String
  lastname: String
  address1: String
  address2: String
  city: String
  state: String
  zip: String
  country: String
  region: String
  email: String
  phone: String
  creditcardtype: String
  creditcard: String
  creditcardexpiration: DateTime
  username: String
  password: String
  age: Int
  income: Float
  gender: String
}

input CustomerUpdateOneInput {
  create: CustomerCreateInput
  update: CustomerUpdateDataInput
  upsert: CustomerUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: CustomerWhereUniqueInput
}

input CustomerUpsertNestedInput {
  update: CustomerUpdateDataInput!
  create: CustomerCreateInput!
}

input CustomerWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  firstname: String
  firstname_not: String
  firstname_in: [String!]
  firstname_not_in: [String!]
  firstname_lt: String
  firstname_lte: String
  firstname_gt: String
  firstname_gte: String
  firstname_contains: String
  firstname_not_contains: String
  firstname_starts_with: String
  firstname_not_starts_with: String
  firstname_ends_with: String
  firstname_not_ends_with: String
  lastname: String
  lastname_not: String
  lastname_in: [String!]
  lastname_not_in: [String!]
  lastname_lt: String
  lastname_lte: String
  lastname_gt: String
  lastname_gte: String
  lastname_contains: String
  lastname_not_contains: String
  lastname_starts_with: String
  lastname_not_starts_with: String
  lastname_ends_with: String
  lastname_not_ends_with: String
  address1: String
  address1_not: String
  address1_in: [String!]
  address1_not_in: [String!]
  address1_lt: String
  address1_lte: String
  address1_gt: String
  address1_gte: String
  address1_contains: String
  address1_not_contains: String
  address1_starts_with: String
  address1_not_starts_with: String
  address1_ends_with: String
  address1_not_ends_with: String
  address2: String
  address2_not: String
  address2_in: [String!]
  address2_not_in: [String!]
  address2_lt: String
  address2_lte: String
  address2_gt: String
  address2_gte: String
  address2_contains: String
  address2_not_contains: String
  address2_starts_with: String
  address2_not_starts_with: String
  address2_ends_with: String
  address2_not_ends_with: String
  city: String
  city_not: String
  city_in: [String!]
  city_not_in: [String!]
  city_lt: String
  city_lte: String
  city_gt: String
  city_gte: String
  city_contains: String
  city_not_contains: String
  city_starts_with: String
  city_not_starts_with: String
  city_ends_with: String
  city_not_ends_with: String
  state: String
  state_not: String
  state_in: [String!]
  state_not_in: [String!]
  state_lt: String
  state_lte: String
  state_gt: String
  state_gte: String
  state_contains: String
  state_not_contains: String
  state_starts_with: String
  state_not_starts_with: String
  state_ends_with: String
  state_not_ends_with: String
  zip: String
  zip_not: String
  zip_in: [String!]
  zip_not_in: [String!]
  zip_lt: String
  zip_lte: String
  zip_gt: String
  zip_gte: String
  zip_contains: String
  zip_not_contains: String
  zip_starts_with: String
  zip_not_starts_with: String
  zip_ends_with: String
  zip_not_ends_with: String
  country: String
  country_not: String
  country_in: [String!]
  country_not_in: [String!]
  country_lt: String
  country_lte: String
  country_gt: String
  country_gte: String
  country_contains: String
  country_not_contains: String
  country_starts_with: String
  country_not_starts_with: String
  country_ends_with: String
  country_not_ends_with: String
  region: String
  region_not: String
  region_in: [String!]
  region_not_in: [String!]
  region_lt: String
  region_lte: String
  region_gt: String
  region_gte: String
  region_contains: String
  region_not_contains: String
  region_starts_with: String
  region_not_starts_with: String
  region_ends_with: String
  region_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  phone: String
  phone_not: String
  phone_in: [String!]
  phone_not_in: [String!]
  phone_lt: String
  phone_lte: String
  phone_gt: String
  phone_gte: String
  phone_contains: String
  phone_not_contains: String
  phone_starts_with: String
  phone_not_starts_with: String
  phone_ends_with: String
  phone_not_ends_with: String
  creditcardtype: String
  creditcardtype_not: String
  creditcardtype_in: [String!]
  creditcardtype_not_in: [String!]
  creditcardtype_lt: String
  creditcardtype_lte: String
  creditcardtype_gt: String
  creditcardtype_gte: String
  creditcardtype_contains: String
  creditcardtype_not_contains: String
  creditcardtype_starts_with: String
  creditcardtype_not_starts_with: String
  creditcardtype_ends_with: String
  creditcardtype_not_ends_with: String
  creditcard: String
  creditcard_not: String
  creditcard_in: [String!]
  creditcard_not_in: [String!]
  creditcard_lt: String
  creditcard_lte: String
  creditcard_gt: String
  creditcard_gte: String
  creditcard_contains: String
  creditcard_not_contains: String
  creditcard_starts_with: String
  creditcard_not_starts_with: String
  creditcard_ends_with: String
  creditcard_not_ends_with: String
  creditcardexpiration: DateTime
  creditcardexpiration_not: DateTime
  creditcardexpiration_in: [DateTime!]
  creditcardexpiration_not_in: [DateTime!]
  creditcardexpiration_lt: DateTime
  creditcardexpiration_lte: DateTime
  creditcardexpiration_gt: DateTime
  creditcardexpiration_gte: DateTime
  username: String
  username_not: String
  username_in: [String!]
  username_not_in: [String!]
  username_lt: String
  username_lte: String
  username_gt: String
  username_gte: String
  username_contains: String
  username_not_contains: String
  username_starts_with: String
  username_not_starts_with: String
  username_ends_with: String
  username_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  age: Int
  age_not: Int
  age_in: [Int!]
  age_not_in: [Int!]
  age_lt: Int
  age_lte: Int
  age_gt: Int
  age_gte: Int
  income: Float
  income_not: Float
  income_in: [Float!]
  income_not_in: [Float!]
  income_lt: Float
  income_lte: Float
  income_gt: Float
  income_gte: Float
  gender: String
  gender_not: String
  gender_in: [String!]
  gender_not_in: [String!]
  gender_lt: String
  gender_lte: String
  gender_gt: String
  gender_gte: String
  gender_contains: String
  gender_not_contains: String
  gender_starts_with: String
  gender_not_starts_with: String
  gender_ends_with: String
  gender_not_ends_with: String
  AND: [CustomerWhereInput!]
}

input CustomerWhereUniqueInput {
  id: ID
}

scalar DateTime

scalar Long

type Mutation {
  createCategory(data: CategoryCreateInput!): Category!
  updateCategory(data: CategoryUpdateInput!, where: CategoryWhereUniqueInput!): Category
  updateManyCategories(data: CategoryUpdateManyMutationInput!, where: CategoryWhereInput): BatchPayload!
  upsertCategory(where: CategoryWhereUniqueInput!, create: CategoryCreateInput!, update: CategoryUpdateInput!): Category!
  deleteCategory(where: CategoryWhereUniqueInput!): Category
  deleteManyCategories(where: CategoryWhereInput): BatchPayload!
  createCustomer(data: CustomerCreateInput!): Customer!
  updateCustomer(data: CustomerUpdateInput!, where: CustomerWhereUniqueInput!): Customer
  updateManyCustomers(data: CustomerUpdateManyMutationInput!, where: CustomerWhereInput): BatchPayload!
  upsertCustomer(where: CustomerWhereUniqueInput!, create: CustomerCreateInput!, update: CustomerUpdateInput!): Customer!
  deleteCustomer(where: CustomerWhereUniqueInput!): Customer
  deleteManyCustomers(where: CustomerWhereInput): BatchPayload!
  createOrder(data: OrderCreateInput!): Order!
  updateOrder(data: OrderUpdateInput!, where: OrderWhereUniqueInput!): Order
  updateManyOrders(data: OrderUpdateManyMutationInput!, where: OrderWhereInput): BatchPayload!
  upsertOrder(where: OrderWhereUniqueInput!, create: OrderCreateInput!, update: OrderUpdateInput!): Order!
  deleteOrder(where: OrderWhereUniqueInput!): Order
  deleteManyOrders(where: OrderWhereInput): BatchPayload!
  createOrderline(data: OrderlineCreateInput!): Orderline!
  updateOrderline(data: OrderlineUpdateInput!, where: OrderlineWhereUniqueInput!): Orderline
  updateManyOrderlines(data: OrderlineUpdateManyMutationInput!, where: OrderlineWhereInput): BatchPayload!
  upsertOrderline(where: OrderlineWhereUniqueInput!, create: OrderlineCreateInput!, update: OrderlineUpdateInput!): Orderline!
  deleteOrderline(where: OrderlineWhereUniqueInput!): Orderline
  deleteManyOrderlines(where: OrderlineWhereInput): BatchPayload!
  createProduct(data: ProductCreateInput!): Product!
  updateProduct(data: ProductUpdateInput!, where: ProductWhereUniqueInput!): Product
  updateManyProducts(data: ProductUpdateManyMutationInput!, where: ProductWhereInput): BatchPayload!
  upsertProduct(where: ProductWhereUniqueInput!, create: ProductCreateInput!, update: ProductUpdateInput!): Product!
  deleteProduct(where: ProductWhereUniqueInput!): Product
  deleteManyProducts(where: ProductWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type Order {
  id: ID!
  orderdate: DateTime
  customer: Customer
  netamount: Float!
  tax: Float!
  totalamount: Float!
  orderline: Orderline
}

type OrderConnection {
  pageInfo: PageInfo!
  edges: [OrderEdge]!
  aggregate: AggregateOrder!
}

input OrderCreateInput {
  id: ID!
  orderdate: DateTime
  customer: CustomerCreateOneInput
  netamount: Float!
  tax: Float!
  totalamount: Float!
  orderline: OrderlineCreateOneWithoutOrderInput
}

input OrderCreateOneWithoutOrderlineInput {
  create: OrderCreateWithoutOrderlineInput
  connect: OrderWhereUniqueInput
}

input OrderCreateWithoutOrderlineInput {
  id: ID!
  orderdate: DateTime
  customer: CustomerCreateOneInput
  netamount: Float!
  tax: Float!
  totalamount: Float!
}

type OrderEdge {
  node: Order!
  cursor: String!
}

type Orderline {
  id: ID!
  order: Order
  product: Product
  quantity: Int
  orderdate: DateTime
}

type OrderlineConnection {
  pageInfo: PageInfo!
  edges: [OrderlineEdge]!
  aggregate: AggregateOrderline!
}

input OrderlineCreateInput {
  id: ID!
  order: OrderCreateOneWithoutOrderlineInput
  product: ProductCreateOneInput
  quantity: Int
  orderdate: DateTime
}

input OrderlineCreateOneWithoutOrderInput {
  create: OrderlineCreateWithoutOrderInput
  connect: OrderlineWhereUniqueInput
}

input OrderlineCreateWithoutOrderInput {
  id: ID!
  product: ProductCreateOneInput
  quantity: Int
  orderdate: DateTime
}

type OrderlineEdge {
  node: Orderline!
  cursor: String!
}

enum OrderlineOrderByInput {
  id_ASC
  id_DESC
  quantity_ASC
  quantity_DESC
  orderdate_ASC
  orderdate_DESC
}

type OrderlinePreviousValues {
  id: ID!
  quantity: Int
  orderdate: DateTime
}

type OrderlineSubscriptionPayload {
  mutation: MutationType!
  node: Orderline
  updatedFields: [String!]
  previousValues: OrderlinePreviousValues
}

input OrderlineSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: OrderlineWhereInput
  AND: [OrderlineSubscriptionWhereInput!]
}

input OrderlineUpdateInput {
  id: ID
  order: OrderUpdateOneWithoutOrderlineInput
  product: ProductUpdateOneInput
  quantity: Int
  orderdate: DateTime
}

input OrderlineUpdateManyMutationInput {
  id: ID
  quantity: Int
  orderdate: DateTime
}

input OrderlineUpdateOneWithoutOrderInput {
  create: OrderlineCreateWithoutOrderInput
  update: OrderlineUpdateWithoutOrderDataInput
  upsert: OrderlineUpsertWithoutOrderInput
  delete: Boolean
  disconnect: Boolean
  connect: OrderlineWhereUniqueInput
}

input OrderlineUpdateWithoutOrderDataInput {
  id: ID
  product: ProductUpdateOneInput
  quantity: Int
  orderdate: DateTime
}

input OrderlineUpsertWithoutOrderInput {
  update: OrderlineUpdateWithoutOrderDataInput!
  create: OrderlineCreateWithoutOrderInput!
}

input OrderlineWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  order: OrderWhereInput
  product: ProductWhereInput
  quantity: Int
  quantity_not: Int
  quantity_in: [Int!]
  quantity_not_in: [Int!]
  quantity_lt: Int
  quantity_lte: Int
  quantity_gt: Int
  quantity_gte: Int
  orderdate: DateTime
  orderdate_not: DateTime
  orderdate_in: [DateTime!]
  orderdate_not_in: [DateTime!]
  orderdate_lt: DateTime
  orderdate_lte: DateTime
  orderdate_gt: DateTime
  orderdate_gte: DateTime
  AND: [OrderlineWhereInput!]
}

input OrderlineWhereUniqueInput {
  id: ID
}

enum OrderOrderByInput {
  id_ASC
  id_DESC
  orderdate_ASC
  orderdate_DESC
  netamount_ASC
  netamount_DESC
  tax_ASC
  tax_DESC
  totalamount_ASC
  totalamount_DESC
}

type OrderPreviousValues {
  id: ID!
  orderdate: DateTime
  netamount: Float!
  tax: Float!
  totalamount: Float!
}

type OrderSubscriptionPayload {
  mutation: MutationType!
  node: Order
  updatedFields: [String!]
  previousValues: OrderPreviousValues
}

input OrderSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: OrderWhereInput
  AND: [OrderSubscriptionWhereInput!]
}

input OrderUpdateInput {
  id: ID
  orderdate: DateTime
  customer: CustomerUpdateOneInput
  netamount: Float
  tax: Float
  totalamount: Float
  orderline: OrderlineUpdateOneWithoutOrderInput
}

input OrderUpdateManyMutationInput {
  id: ID
  orderdate: DateTime
  netamount: Float
  tax: Float
  totalamount: Float
}

input OrderUpdateOneWithoutOrderlineInput {
  create: OrderCreateWithoutOrderlineInput
  update: OrderUpdateWithoutOrderlineDataInput
  upsert: OrderUpsertWithoutOrderlineInput
  delete: Boolean
  disconnect: Boolean
  connect: OrderWhereUniqueInput
}

input OrderUpdateWithoutOrderlineDataInput {
  id: ID
  orderdate: DateTime
  customer: CustomerUpdateOneInput
  netamount: Float
  tax: Float
  totalamount: Float
}

input OrderUpsertWithoutOrderlineInput {
  update: OrderUpdateWithoutOrderlineDataInput!
  create: OrderCreateWithoutOrderlineInput!
}

input OrderWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  orderdate: DateTime
  orderdate_not: DateTime
  orderdate_in: [DateTime!]
  orderdate_not_in: [DateTime!]
  orderdate_lt: DateTime
  orderdate_lte: DateTime
  orderdate_gt: DateTime
  orderdate_gte: DateTime
  customer: CustomerWhereInput
  netamount: Float
  netamount_not: Float
  netamount_in: [Float!]
  netamount_not_in: [Float!]
  netamount_lt: Float
  netamount_lte: Float
  netamount_gt: Float
  netamount_gte: Float
  tax: Float
  tax_not: Float
  tax_in: [Float!]
  tax_not_in: [Float!]
  tax_lt: Float
  tax_lte: Float
  tax_gt: Float
  tax_gte: Float
  totalamount: Float
  totalamount_not: Float
  totalamount_in: [Float!]
  totalamount_not_in: [Float!]
  totalamount_lt: Float
  totalamount_lte: Float
  totalamount_gt: Float
  totalamount_gte: Float
  orderline: OrderlineWhereInput
  AND: [OrderWhereInput!]
}

input OrderWhereUniqueInput {
  id: ID
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Product {
  id: ID!
  category: Category
  title: String!
  actor: String
  price: Float!
  special: Int
  common_prod_id: Int
}

type ProductConnection {
  pageInfo: PageInfo!
  edges: [ProductEdge]!
  aggregate: AggregateProduct!
}

input ProductCreateInput {
  id: ID!
  category: CategoryCreateOneInput
  title: String!
  actor: String
  price: Float!
  special: Int
  common_prod_id: Int
}

input ProductCreateOneInput {
  create: ProductCreateInput
  connect: ProductWhereUniqueInput
}

type ProductEdge {
  node: Product!
  cursor: String!
}

enum ProductOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  actor_ASC
  actor_DESC
  price_ASC
  price_DESC
  special_ASC
  special_DESC
  common_prod_id_ASC
  common_prod_id_DESC
}

type ProductPreviousValues {
  id: ID!
  title: String!
  actor: String
  price: Float!
  special: Int
  common_prod_id: Int
}

type ProductSubscriptionPayload {
  mutation: MutationType!
  node: Product
  updatedFields: [String!]
  previousValues: ProductPreviousValues
}

input ProductSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ProductWhereInput
  AND: [ProductSubscriptionWhereInput!]
}

input ProductUpdateDataInput {
  id: ID
  category: CategoryUpdateOneInput
  title: String
  actor: String
  price: Float
  special: Int
  common_prod_id: Int
}

input ProductUpdateInput {
  id: ID
  category: CategoryUpdateOneInput
  title: String
  actor: String
  price: Float
  special: Int
  common_prod_id: Int
}

input ProductUpdateManyMutationInput {
  id: ID
  title: String
  actor: String
  price: Float
  special: Int
  common_prod_id: Int
}

input ProductUpdateOneInput {
  create: ProductCreateInput
  update: ProductUpdateDataInput
  upsert: ProductUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: ProductWhereUniqueInput
}

input ProductUpsertNestedInput {
  update: ProductUpdateDataInput!
  create: ProductCreateInput!
}

input ProductWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  category: CategoryWhereInput
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  actor: String
  actor_not: String
  actor_in: [String!]
  actor_not_in: [String!]
  actor_lt: String
  actor_lte: String
  actor_gt: String
  actor_gte: String
  actor_contains: String
  actor_not_contains: String
  actor_starts_with: String
  actor_not_starts_with: String
  actor_ends_with: String
  actor_not_ends_with: String
  price: Float
  price_not: Float
  price_in: [Float!]
  price_not_in: [Float!]
  price_lt: Float
  price_lte: Float
  price_gt: Float
  price_gte: Float
  special: Int
  special_not: Int
  special_in: [Int!]
  special_not_in: [Int!]
  special_lt: Int
  special_lte: Int
  special_gt: Int
  special_gte: Int
  common_prod_id: Int
  common_prod_id_not: Int
  common_prod_id_in: [Int!]
  common_prod_id_not_in: [Int!]
  common_prod_id_lt: Int
  common_prod_id_lte: Int
  common_prod_id_gt: Int
  common_prod_id_gte: Int
  AND: [ProductWhereInput!]
}

input ProductWhereUniqueInput {
  id: ID
}

type Query {
  category(where: CategoryWhereUniqueInput!): Category
  categories(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Category]!
  categoriesConnection(where: CategoryWhereInput, orderBy: CategoryOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CategoryConnection!
  customer(where: CustomerWhereUniqueInput!): Customer
  customers(where: CustomerWhereInput, orderBy: CustomerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Customer]!
  customersConnection(where: CustomerWhereInput, orderBy: CustomerOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): CustomerConnection!
  order(where: OrderWhereUniqueInput!): Order
  orders(where: OrderWhereInput, orderBy: OrderOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Order]!
  ordersConnection(where: OrderWhereInput, orderBy: OrderOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): OrderConnection!
  orderline(where: OrderlineWhereUniqueInput!): Orderline
  orderlines(where: OrderlineWhereInput, orderBy: OrderlineOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Orderline]!
  orderlinesConnection(where: OrderlineWhereInput, orderBy: OrderlineOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): OrderlineConnection!
  product(where: ProductWhereUniqueInput!): Product
  products(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Product]!
  productsConnection(where: ProductWhereInput, orderBy: ProductOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ProductConnection!
  node(id: ID!): Node
}

type Subscription {
  category(where: CategorySubscriptionWhereInput): CategorySubscriptionPayload
  customer(where: CustomerSubscriptionWhereInput): CustomerSubscriptionPayload
  order(where: OrderSubscriptionWhereInput): OrderSubscriptionPayload
  orderline(where: OrderlineSubscriptionWhereInput): OrderlineSubscriptionPayload
  product(where: ProductSubscriptionWhereInput): ProductSubscriptionPayload
}
`
      }
    