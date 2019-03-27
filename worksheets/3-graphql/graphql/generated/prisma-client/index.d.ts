// Code generated by Prisma (prisma@1.28.5). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode } from "graphql";
import {
  makePrismaClientClass,
  BaseClientOptions,
  Model
} from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface Exists {
  category: (where?: CategoryWhereInput) => Promise<boolean>;
  inventory: (where?: InventoryWhereInput) => Promise<boolean>;
  product: (where?: ProductWhereInput) => Promise<boolean>;
  reorder: (where?: ReorderWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;

  /**
   * Queries
   */

  category: (where: CategoryWhereUniqueInput) => CategoryPromise;
  categories: (
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Category>;
  categoriesConnection: (
    args?: {
      where?: CategoryWhereInput;
      orderBy?: CategoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => CategoryConnectionPromise;
  inventory: (where: InventoryWhereUniqueInput) => InventoryPromise;
  inventories: (
    args?: {
      where?: InventoryWhereInput;
      orderBy?: InventoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Inventory>;
  inventoriesConnection: (
    args?: {
      where?: InventoryWhereInput;
      orderBy?: InventoryOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => InventoryConnectionPromise;
  product: (where: ProductWhereUniqueInput) => ProductPromise;
  products: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Product>;
  productsConnection: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => ProductConnectionPromise;
  reorder: (where: ReorderWhereUniqueInput) => ReorderPromise;
  reorders: (
    args?: {
      where?: ReorderWhereInput;
      orderBy?: ReorderOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Reorder>;
  reordersConnection: (
    args?: {
      where?: ReorderWhereInput;
      orderBy?: ReorderOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => ReorderConnectionPromise;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createCategory: (data: CategoryCreateInput) => CategoryPromise;
  updateCategory: (
    args: { data: CategoryUpdateInput; where: CategoryWhereUniqueInput }
  ) => CategoryPromise;
  updateManyCategories: (
    args: { data: CategoryUpdateManyMutationInput; where?: CategoryWhereInput }
  ) => BatchPayloadPromise;
  upsertCategory: (
    args: {
      where: CategoryWhereUniqueInput;
      create: CategoryCreateInput;
      update: CategoryUpdateInput;
    }
  ) => CategoryPromise;
  deleteCategory: (where: CategoryWhereUniqueInput) => CategoryPromise;
  deleteManyCategories: (where?: CategoryWhereInput) => BatchPayloadPromise;
  createInventory: (data: InventoryCreateInput) => InventoryPromise;
  updateInventory: (
    args: { data: InventoryUpdateInput; where: InventoryWhereUniqueInput }
  ) => InventoryPromise;
  updateManyInventories: (
    args: {
      data: InventoryUpdateManyMutationInput;
      where?: InventoryWhereInput;
    }
  ) => BatchPayloadPromise;
  upsertInventory: (
    args: {
      where: InventoryWhereUniqueInput;
      create: InventoryCreateInput;
      update: InventoryUpdateInput;
    }
  ) => InventoryPromise;
  deleteInventory: (where: InventoryWhereUniqueInput) => InventoryPromise;
  deleteManyInventories: (where?: InventoryWhereInput) => BatchPayloadPromise;
  createProduct: (data: ProductCreateInput) => ProductPromise;
  updateProduct: (
    args: { data: ProductUpdateInput; where: ProductWhereUniqueInput }
  ) => ProductPromise;
  updateManyProducts: (
    args: { data: ProductUpdateManyMutationInput; where?: ProductWhereInput }
  ) => BatchPayloadPromise;
  upsertProduct: (
    args: {
      where: ProductWhereUniqueInput;
      create: ProductCreateInput;
      update: ProductUpdateInput;
    }
  ) => ProductPromise;
  deleteProduct: (where: ProductWhereUniqueInput) => ProductPromise;
  deleteManyProducts: (where?: ProductWhereInput) => BatchPayloadPromise;
  createReorder: (data: ReorderCreateInput) => ReorderPromise;
  updateReorder: (
    args: { data: ReorderUpdateInput; where: ReorderWhereUniqueInput }
  ) => ReorderPromise;
  updateManyReorders: (
    args: { data: ReorderUpdateManyMutationInput; where?: ReorderWhereInput }
  ) => BatchPayloadPromise;
  upsertReorder: (
    args: {
      where: ReorderWhereUniqueInput;
      create: ReorderCreateInput;
      update: ReorderUpdateInput;
    }
  ) => ReorderPromise;
  deleteReorder: (where: ReorderWhereUniqueInput) => ReorderPromise;
  deleteManyReorders: (where?: ReorderWhereInput) => BatchPayloadPromise;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  category: (
    where?: CategorySubscriptionWhereInput
  ) => CategorySubscriptionPayloadSubscription;
  inventory: (
    where?: InventorySubscriptionWhereInput
  ) => InventorySubscriptionPayloadSubscription;
  product: (
    where?: ProductSubscriptionWhereInput
  ) => ProductSubscriptionPayloadSubscription;
  reorder: (
    where?: ReorderSubscriptionWhereInput
  ) => ReorderSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export type InventoryOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "quan_in_stock_ASC"
  | "quan_in_stock_DESC"
  | "sales_ASC"
  | "sales_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type CategoryOrderByInput =
  | "category_ASC"
  | "category_DESC"
  | "categoryname_ASC"
  | "categoryname_DESC"
  | "id_ASC"
  | "id_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type ProductOrderByInput =
  | "prod_id_ASC"
  | "prod_id_DESC"
  | "title_ASC"
  | "title_DESC"
  | "actor_ASC"
  | "actor_DESC"
  | "price_ASC"
  | "price_DESC"
  | "special_ASC"
  | "special_DESC"
  | "common_prod_id_ASC"
  | "common_prod_id_DESC"
  | "id_ASC"
  | "id_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type ReorderOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "date_low_ASC"
  | "date_low_DESC"
  | "quan_low_ASC"
  | "quan_low_DESC"
  | "date_reordered_ASC"
  | "date_reordered_DESC"
  | "quan_reordered_ASC"
  | "quan_reordered_DESC"
  | "date_expected_ASC"
  | "date_expected_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export interface ProductUpsertNestedInput {
  update: ProductUpdateDataInput;
  create: ProductCreateInput;
}

export interface CategoryUpdateInput {
  category?: ID_Input;
  categoryname?: String;
}

export interface CategoryWhereInput {
  category?: ID_Input;
  category_not?: ID_Input;
  category_in?: ID_Input[] | ID_Input;
  category_not_in?: ID_Input[] | ID_Input;
  category_lt?: ID_Input;
  category_lte?: ID_Input;
  category_gt?: ID_Input;
  category_gte?: ID_Input;
  category_contains?: ID_Input;
  category_not_contains?: ID_Input;
  category_starts_with?: ID_Input;
  category_not_starts_with?: ID_Input;
  category_ends_with?: ID_Input;
  category_not_ends_with?: ID_Input;
  categoryname?: String;
  categoryname_not?: String;
  categoryname_in?: String[] | String;
  categoryname_not_in?: String[] | String;
  categoryname_lt?: String;
  categoryname_lte?: String;
  categoryname_gt?: String;
  categoryname_gte?: String;
  categoryname_contains?: String;
  categoryname_not_contains?: String;
  categoryname_starts_with?: String;
  categoryname_not_starts_with?: String;
  categoryname_ends_with?: String;
  categoryname_not_ends_with?: String;
  AND?: CategoryWhereInput[] | CategoryWhereInput;
  OR?: CategoryWhereInput[] | CategoryWhereInput;
  NOT?: CategoryWhereInput[] | CategoryWhereInput;
}

export type CategoryWhereUniqueInput = AtLeastOne<{
  category: ID_Input;
}>;

export interface CategoryUpdateOneInput {
  create?: CategoryCreateInput;
  update?: CategoryUpdateDataInput;
  upsert?: CategoryUpsertNestedInput;
  delete?: Boolean;
  disconnect?: Boolean;
  connect?: CategoryWhereUniqueInput;
}

export interface CategorySubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: CategoryWhereInput;
  AND?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
  OR?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
  NOT?: CategorySubscriptionWhereInput[] | CategorySubscriptionWhereInput;
}

export interface ProductUpdateDataInput {
  prod_id?: ID_Input;
  category?: CategoryUpdateOneInput;
  title?: String;
  actor?: String;
  price?: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface ReorderUpdateInput {
  prod_id?: ProductUpdateOneInput;
  date_low?: DateTimeInput;
  quan_low?: Int;
  date_reordered?: DateTimeInput;
  quan_reordered?: Int;
  date_expected?: DateTimeInput;
}

export interface ProductUpdateOneInput {
  create?: ProductCreateInput;
  update?: ProductUpdateDataInput;
  upsert?: ProductUpsertNestedInput;
  delete?: Boolean;
  disconnect?: Boolean;
  connect?: ProductWhereUniqueInput;
}

export type InventoryWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export type ReorderWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface ProductUpdateInput {
  prod_id?: ID_Input;
  category?: CategoryUpdateOneInput;
  title?: String;
  actor?: String;
  price?: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface InventoryUpdateInput {
  product?: ProductUpdateOneInput;
  quan_in_stock?: Int;
  sales?: Int;
}

export interface InventoryWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  product?: ProductWhereInput;
  quan_in_stock?: Int;
  quan_in_stock_not?: Int;
  quan_in_stock_in?: Int[] | Int;
  quan_in_stock_not_in?: Int[] | Int;
  quan_in_stock_lt?: Int;
  quan_in_stock_lte?: Int;
  quan_in_stock_gt?: Int;
  quan_in_stock_gte?: Int;
  sales?: Int;
  sales_not?: Int;
  sales_in?: Int[] | Int;
  sales_not_in?: Int[] | Int;
  sales_lt?: Int;
  sales_lte?: Int;
  sales_gt?: Int;
  sales_gte?: Int;
  AND?: InventoryWhereInput[] | InventoryWhereInput;
  OR?: InventoryWhereInput[] | InventoryWhereInput;
  NOT?: InventoryWhereInput[] | InventoryWhereInput;
}

export interface CategoryCreateOneInput {
  create?: CategoryCreateInput;
  connect?: CategoryWhereUniqueInput;
}

export interface InventorySubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: InventoryWhereInput;
  AND?: InventorySubscriptionWhereInput[] | InventorySubscriptionWhereInput;
  OR?: InventorySubscriptionWhereInput[] | InventorySubscriptionWhereInput;
  NOT?: InventorySubscriptionWhereInput[] | InventorySubscriptionWhereInput;
}

export interface ReorderWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  prod_id?: ProductWhereInput;
  date_low?: DateTimeInput;
  date_low_not?: DateTimeInput;
  date_low_in?: DateTimeInput[] | DateTimeInput;
  date_low_not_in?: DateTimeInput[] | DateTimeInput;
  date_low_lt?: DateTimeInput;
  date_low_lte?: DateTimeInput;
  date_low_gt?: DateTimeInput;
  date_low_gte?: DateTimeInput;
  quan_low?: Int;
  quan_low_not?: Int;
  quan_low_in?: Int[] | Int;
  quan_low_not_in?: Int[] | Int;
  quan_low_lt?: Int;
  quan_low_lte?: Int;
  quan_low_gt?: Int;
  quan_low_gte?: Int;
  date_reordered?: DateTimeInput;
  date_reordered_not?: DateTimeInput;
  date_reordered_in?: DateTimeInput[] | DateTimeInput;
  date_reordered_not_in?: DateTimeInput[] | DateTimeInput;
  date_reordered_lt?: DateTimeInput;
  date_reordered_lte?: DateTimeInput;
  date_reordered_gt?: DateTimeInput;
  date_reordered_gte?: DateTimeInput;
  quan_reordered?: Int;
  quan_reordered_not?: Int;
  quan_reordered_in?: Int[] | Int;
  quan_reordered_not_in?: Int[] | Int;
  quan_reordered_lt?: Int;
  quan_reordered_lte?: Int;
  quan_reordered_gt?: Int;
  quan_reordered_gte?: Int;
  date_expected?: DateTimeInput;
  date_expected_not?: DateTimeInput;
  date_expected_in?: DateTimeInput[] | DateTimeInput;
  date_expected_not_in?: DateTimeInput[] | DateTimeInput;
  date_expected_lt?: DateTimeInput;
  date_expected_lte?: DateTimeInput;
  date_expected_gt?: DateTimeInput;
  date_expected_gte?: DateTimeInput;
  AND?: ReorderWhereInput[] | ReorderWhereInput;
  OR?: ReorderWhereInput[] | ReorderWhereInput;
  NOT?: ReorderWhereInput[] | ReorderWhereInput;
}

export interface CategoryUpsertNestedInput {
  update: CategoryUpdateDataInput;
  create: CategoryCreateInput;
}

export interface ProductSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: ProductWhereInput;
  AND?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  OR?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  NOT?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
}

export type ProductWhereUniqueInput = AtLeastOne<{
  prod_id: ID_Input;
}>;

export interface ProductCreateInput {
  prod_id: ID_Input;
  category?: CategoryCreateOneInput;
  title: String;
  actor?: String;
  price: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface ReorderCreateInput {
  prod_id?: ProductCreateOneInput;
  date_low?: DateTimeInput;
  quan_low?: Int;
  date_reordered?: DateTimeInput;
  quan_reordered?: Int;
  date_expected?: DateTimeInput;
}

export interface InventoryUpdateManyMutationInput {
  quan_in_stock?: Int;
  sales?: Int;
}

export interface CategoryCreateInput {
  category: ID_Input;
  categoryname: String;
}

export interface CategoryUpdateManyMutationInput {
  category?: ID_Input;
  categoryname?: String;
}

export interface InventoryCreateInput {
  product?: ProductCreateOneInput;
  quan_in_stock?: Int;
  sales?: Int;
}

export interface ProductCreateOneInput {
  create?: ProductCreateInput;
  connect?: ProductWhereUniqueInput;
}

export interface ProductWhereInput {
  prod_id?: ID_Input;
  prod_id_not?: ID_Input;
  prod_id_in?: ID_Input[] | ID_Input;
  prod_id_not_in?: ID_Input[] | ID_Input;
  prod_id_lt?: ID_Input;
  prod_id_lte?: ID_Input;
  prod_id_gt?: ID_Input;
  prod_id_gte?: ID_Input;
  prod_id_contains?: ID_Input;
  prod_id_not_contains?: ID_Input;
  prod_id_starts_with?: ID_Input;
  prod_id_not_starts_with?: ID_Input;
  prod_id_ends_with?: ID_Input;
  prod_id_not_ends_with?: ID_Input;
  category?: CategoryWhereInput;
  title?: String;
  title_not?: String;
  title_in?: String[] | String;
  title_not_in?: String[] | String;
  title_lt?: String;
  title_lte?: String;
  title_gt?: String;
  title_gte?: String;
  title_contains?: String;
  title_not_contains?: String;
  title_starts_with?: String;
  title_not_starts_with?: String;
  title_ends_with?: String;
  title_not_ends_with?: String;
  actor?: String;
  actor_not?: String;
  actor_in?: String[] | String;
  actor_not_in?: String[] | String;
  actor_lt?: String;
  actor_lte?: String;
  actor_gt?: String;
  actor_gte?: String;
  actor_contains?: String;
  actor_not_contains?: String;
  actor_starts_with?: String;
  actor_not_starts_with?: String;
  actor_ends_with?: String;
  actor_not_ends_with?: String;
  price?: Float;
  price_not?: Float;
  price_in?: Float[] | Float;
  price_not_in?: Float[] | Float;
  price_lt?: Float;
  price_lte?: Float;
  price_gt?: Float;
  price_gte?: Float;
  special?: Float;
  special_not?: Float;
  special_in?: Float[] | Float;
  special_not_in?: Float[] | Float;
  special_lt?: Float;
  special_lte?: Float;
  special_gt?: Float;
  special_gte?: Float;
  common_prod_id?: Int;
  common_prod_id_not?: Int;
  common_prod_id_in?: Int[] | Int;
  common_prod_id_not_in?: Int[] | Int;
  common_prod_id_lt?: Int;
  common_prod_id_lte?: Int;
  common_prod_id_gt?: Int;
  common_prod_id_gte?: Int;
  AND?: ProductWhereInput[] | ProductWhereInput;
  OR?: ProductWhereInput[] | ProductWhereInput;
  NOT?: ProductWhereInput[] | ProductWhereInput;
}

export interface ProductUpdateManyMutationInput {
  prod_id?: ID_Input;
  title?: String;
  actor?: String;
  price?: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface ReorderUpdateManyMutationInput {
  date_low?: DateTimeInput;
  quan_low?: Int;
  date_reordered?: DateTimeInput;
  quan_reordered?: Int;
  date_expected?: DateTimeInput;
}

export interface CategoryUpdateDataInput {
  category?: ID_Input;
  categoryname?: String;
}

export interface ReorderSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: ReorderWhereInput;
  AND?: ReorderSubscriptionWhereInput[] | ReorderSubscriptionWhereInput;
  OR?: ReorderSubscriptionWhereInput[] | ReorderSubscriptionWhereInput;
  NOT?: ReorderSubscriptionWhereInput[] | ReorderSubscriptionWhereInput;
}

export interface NodeNode {
  id: ID_Output;
}

export interface Inventory {
  id: ID_Output;
  quan_in_stock?: Int;
  sales?: Int;
}

export interface InventoryPromise extends Promise<Inventory>, Fragmentable {
  id: () => Promise<ID_Output>;
  product: <T = ProductPromise>() => T;
  quan_in_stock: () => Promise<Int>;
  sales: () => Promise<Int>;
}

export interface InventorySubscription
  extends Promise<AsyncIterator<Inventory>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  product: <T = ProductSubscription>() => T;
  quan_in_stock: () => Promise<AsyncIterator<Int>>;
  sales: () => Promise<AsyncIterator<Int>>;
}

export interface ReorderPreviousValues {
  id: ID_Output;
  date_low?: DateTimeOutput;
  quan_low?: Int;
  date_reordered?: DateTimeOutput;
  quan_reordered?: Int;
  date_expected?: DateTimeOutput;
}

export interface ReorderPreviousValuesPromise
  extends Promise<ReorderPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  date_low: () => Promise<DateTimeOutput>;
  quan_low: () => Promise<Int>;
  date_reordered: () => Promise<DateTimeOutput>;
  quan_reordered: () => Promise<Int>;
  date_expected: () => Promise<DateTimeOutput>;
}

export interface ReorderPreviousValuesSubscription
  extends Promise<AsyncIterator<ReorderPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  date_low: () => Promise<AsyncIterator<DateTimeOutput>>;
  quan_low: () => Promise<AsyncIterator<Int>>;
  date_reordered: () => Promise<AsyncIterator<DateTimeOutput>>;
  quan_reordered: () => Promise<AsyncIterator<Int>>;
  date_expected: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface Product {
  prod_id: ID_Output;
  title: String;
  actor?: String;
  price: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface ProductPromise extends Promise<Product>, Fragmentable {
  prod_id: () => Promise<ID_Output>;
  category: <T = CategoryPromise>() => T;
  title: () => Promise<String>;
  actor: () => Promise<String>;
  price: () => Promise<Float>;
  special: () => Promise<Float>;
  common_prod_id: () => Promise<Int>;
}

export interface ProductSubscription
  extends Promise<AsyncIterator<Product>>,
    Fragmentable {
  prod_id: () => Promise<AsyncIterator<ID_Output>>;
  category: <T = CategorySubscription>() => T;
  title: () => Promise<AsyncIterator<String>>;
  actor: () => Promise<AsyncIterator<String>>;
  price: () => Promise<AsyncIterator<Float>>;
  special: () => Promise<AsyncIterator<Float>>;
  common_prod_id: () => Promise<AsyncIterator<Int>>;
}

export interface InventoryPreviousValues {
  id: ID_Output;
  quan_in_stock?: Int;
  sales?: Int;
}

export interface InventoryPreviousValuesPromise
  extends Promise<InventoryPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  quan_in_stock: () => Promise<Int>;
  sales: () => Promise<Int>;
}

export interface InventoryPreviousValuesSubscription
  extends Promise<AsyncIterator<InventoryPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  quan_in_stock: () => Promise<AsyncIterator<Int>>;
  sales: () => Promise<AsyncIterator<Int>>;
}

export interface BatchPayload {
  count: Long;
}

export interface BatchPayloadPromise
  extends Promise<BatchPayload>,
    Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayload>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface AggregateCategory {
  count: Int;
}

export interface AggregateCategoryPromise
  extends Promise<AggregateCategory>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateCategorySubscription
  extends Promise<AsyncIterator<AggregateCategory>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface AggregateReorder {
  count: Int;
}

export interface AggregateReorderPromise
  extends Promise<AggregateReorder>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateReorderSubscription
  extends Promise<AsyncIterator<AggregateReorder>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface ReorderConnection {
  pageInfo: PageInfo;
  edges: ReorderEdge[];
}

export interface ReorderConnectionPromise
  extends Promise<ReorderConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<ReorderEdge>>() => T;
  aggregate: <T = AggregateReorderPromise>() => T;
}

export interface ReorderConnectionSubscription
  extends Promise<AsyncIterator<ReorderConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<ReorderEdgeSubscription>>>() => T;
  aggregate: <T = AggregateReorderSubscription>() => T;
}

export interface CategoryEdge {
  node: Category;
  cursor: String;
}

export interface CategoryEdgePromise
  extends Promise<CategoryEdge>,
    Fragmentable {
  node: <T = CategoryPromise>() => T;
  cursor: () => Promise<String>;
}

export interface CategoryEdgeSubscription
  extends Promise<AsyncIterator<CategoryEdge>>,
    Fragmentable {
  node: <T = CategorySubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface Reorder {
  id: ID_Output;
  date_low?: DateTimeOutput;
  quan_low?: Int;
  date_reordered?: DateTimeOutput;
  quan_reordered?: Int;
  date_expected?: DateTimeOutput;
}

export interface ReorderPromise extends Promise<Reorder>, Fragmentable {
  id: () => Promise<ID_Output>;
  prod_id: <T = ProductPromise>() => T;
  date_low: () => Promise<DateTimeOutput>;
  quan_low: () => Promise<Int>;
  date_reordered: () => Promise<DateTimeOutput>;
  quan_reordered: () => Promise<Int>;
  date_expected: () => Promise<DateTimeOutput>;
}

export interface ReorderSubscription
  extends Promise<AsyncIterator<Reorder>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  prod_id: <T = ProductSubscription>() => T;
  date_low: () => Promise<AsyncIterator<DateTimeOutput>>;
  quan_low: () => Promise<AsyncIterator<Int>>;
  date_reordered: () => Promise<AsyncIterator<DateTimeOutput>>;
  quan_reordered: () => Promise<AsyncIterator<Int>>;
  date_expected: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface ProductPreviousValues {
  prod_id: ID_Output;
  title: String;
  actor?: String;
  price: Float;
  special?: Float;
  common_prod_id?: Int;
}

export interface ProductPreviousValuesPromise
  extends Promise<ProductPreviousValues>,
    Fragmentable {
  prod_id: () => Promise<ID_Output>;
  title: () => Promise<String>;
  actor: () => Promise<String>;
  price: () => Promise<Float>;
  special: () => Promise<Float>;
  common_prod_id: () => Promise<Int>;
}

export interface ProductPreviousValuesSubscription
  extends Promise<AsyncIterator<ProductPreviousValues>>,
    Fragmentable {
  prod_id: () => Promise<AsyncIterator<ID_Output>>;
  title: () => Promise<AsyncIterator<String>>;
  actor: () => Promise<AsyncIterator<String>>;
  price: () => Promise<AsyncIterator<Float>>;
  special: () => Promise<AsyncIterator<Float>>;
  common_prod_id: () => Promise<AsyncIterator<Int>>;
}

export interface ProductEdge {
  node: Product;
  cursor: String;
}

export interface ProductEdgePromise extends Promise<ProductEdge>, Fragmentable {
  node: <T = ProductPromise>() => T;
  cursor: () => Promise<String>;
}

export interface ProductEdgeSubscription
  extends Promise<AsyncIterator<ProductEdge>>,
    Fragmentable {
  node: <T = ProductSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfoPromise extends Promise<PageInfo>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfo>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface AggregateInventory {
  count: Int;
}

export interface AggregateInventoryPromise
  extends Promise<AggregateInventory>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateInventorySubscription
  extends Promise<AsyncIterator<AggregateInventory>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface CategoryConnection {
  pageInfo: PageInfo;
  edges: CategoryEdge[];
}

export interface CategoryConnectionPromise
  extends Promise<CategoryConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<CategoryEdge>>() => T;
  aggregate: <T = AggregateCategoryPromise>() => T;
}

export interface CategoryConnectionSubscription
  extends Promise<AsyncIterator<CategoryConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<CategoryEdgeSubscription>>>() => T;
  aggregate: <T = AggregateCategorySubscription>() => T;
}

export interface InventoryConnection {
  pageInfo: PageInfo;
  edges: InventoryEdge[];
}

export interface InventoryConnectionPromise
  extends Promise<InventoryConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<InventoryEdge>>() => T;
  aggregate: <T = AggregateInventoryPromise>() => T;
}

export interface InventoryConnectionSubscription
  extends Promise<AsyncIterator<InventoryConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<InventoryEdgeSubscription>>>() => T;
  aggregate: <T = AggregateInventorySubscription>() => T;
}

export interface ReorderEdge {
  node: Reorder;
  cursor: String;
}

export interface ReorderEdgePromise extends Promise<ReorderEdge>, Fragmentable {
  node: <T = ReorderPromise>() => T;
  cursor: () => Promise<String>;
}

export interface ReorderEdgeSubscription
  extends Promise<AsyncIterator<ReorderEdge>>,
    Fragmentable {
  node: <T = ReorderSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface InventorySubscriptionPayload {
  mutation: MutationType;
  node: Inventory;
  updatedFields: String[];
  previousValues: InventoryPreviousValues;
}

export interface InventorySubscriptionPayloadPromise
  extends Promise<InventorySubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = InventoryPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = InventoryPreviousValuesPromise>() => T;
}

export interface InventorySubscriptionPayloadSubscription
  extends Promise<AsyncIterator<InventorySubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = InventorySubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = InventoryPreviousValuesSubscription>() => T;
}

export interface ProductSubscriptionPayload {
  mutation: MutationType;
  node: Product;
  updatedFields: String[];
  previousValues: ProductPreviousValues;
}

export interface ProductSubscriptionPayloadPromise
  extends Promise<ProductSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = ProductPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = ProductPreviousValuesPromise>() => T;
}

export interface ProductSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<ProductSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = ProductSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = ProductPreviousValuesSubscription>() => T;
}

export interface CategoryPreviousValues {
  category: ID_Output;
  categoryname: String;
}

export interface CategoryPreviousValuesPromise
  extends Promise<CategoryPreviousValues>,
    Fragmentable {
  category: () => Promise<ID_Output>;
  categoryname: () => Promise<String>;
}

export interface CategoryPreviousValuesSubscription
  extends Promise<AsyncIterator<CategoryPreviousValues>>,
    Fragmentable {
  category: () => Promise<AsyncIterator<ID_Output>>;
  categoryname: () => Promise<AsyncIterator<String>>;
}

export interface CategorySubscriptionPayload {
  mutation: MutationType;
  node: Category;
  updatedFields: String[];
  previousValues: CategoryPreviousValues;
}

export interface CategorySubscriptionPayloadPromise
  extends Promise<CategorySubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = CategoryPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = CategoryPreviousValuesPromise>() => T;
}

export interface CategorySubscriptionPayloadSubscription
  extends Promise<AsyncIterator<CategorySubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = CategorySubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = CategoryPreviousValuesSubscription>() => T;
}

export interface ReorderSubscriptionPayload {
  mutation: MutationType;
  node: Reorder;
  updatedFields: String[];
  previousValues: ReorderPreviousValues;
}

export interface ReorderSubscriptionPayloadPromise
  extends Promise<ReorderSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = ReorderPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = ReorderPreviousValuesPromise>() => T;
}

export interface ReorderSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<ReorderSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = ReorderSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = ReorderPreviousValuesSubscription>() => T;
}

export interface Category {
  category: ID_Output;
  categoryname: String;
}

export interface CategoryPromise extends Promise<Category>, Fragmentable {
  category: () => Promise<ID_Output>;
  categoryname: () => Promise<String>;
}

export interface CategorySubscription
  extends Promise<AsyncIterator<Category>>,
    Fragmentable {
  category: () => Promise<AsyncIterator<ID_Output>>;
  categoryname: () => Promise<AsyncIterator<String>>;
}

export interface InventoryEdge {
  node: Inventory;
  cursor: String;
}

export interface InventoryEdgePromise
  extends Promise<InventoryEdge>,
    Fragmentable {
  node: <T = InventoryPromise>() => T;
  cursor: () => Promise<String>;
}

export interface InventoryEdgeSubscription
  extends Promise<AsyncIterator<InventoryEdge>>,
    Fragmentable {
  node: <T = InventorySubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface ProductConnection {
  pageInfo: PageInfo;
  edges: ProductEdge[];
}

export interface ProductConnectionPromise
  extends Promise<ProductConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<ProductEdge>>() => T;
  aggregate: <T = AggregateProductPromise>() => T;
}

export interface ProductConnectionSubscription
  extends Promise<AsyncIterator<ProductConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<ProductEdgeSubscription>>>() => T;
  aggregate: <T = AggregateProductSubscription>() => T;
}

export interface AggregateProduct {
  count: Int;
}

export interface AggregateProductPromise
  extends Promise<AggregateProduct>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateProductSubscription
  extends Promise<AsyncIterator<AggregateProduct>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

export type Long = string;

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string;

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string;

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). 
*/
export type Float = number;

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

/**
 * Model Metadata
 */

export const models: Model[] = [
  {
    name: "Category",
    embedded: false
  },
  {
    name: "Product",
    embedded: false
  },
  {
    name: "Inventory",
    embedded: false
  },
  {
    name: "Reorder",
    embedded: false
  }
];

/**
 * Type Defs
 */

export const prisma: Prisma;
