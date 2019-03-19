# Lab 3 - GraphQL
### Part 1
The implemented relations

![Alt text](images/1tablesImplemented.png)

The data model code

![Alt text](images/1dataModel.png?raw=true "Title")

The qraphql code

![Alt text](images/1graphqlSchema.png?raw=true "Title")


### Part 2
Resolver for basic query 

![Alt text](images/2resolver.png?raw=true "Title")

Query returns a number of attributes

![Alt text](images/2output.png)


### Part 3
What it does: Displays a detailed breakdown of a product in the system, including it's name, price, category, amount currently in stock and amount sold.
Resolver for query that deals with two relations

![Alt text](images/3resolver.png?raw=true "Title")

Resolver for building connections

![Alt text](images/3nestingRelationships.png?raw=true "Title")

Query output showing two connected realtions

![Alt text](images/3output.png?raw=true "Title")


### Part 4
What it does: Makes it possible to generate a reorder in the system when quantities become too low and associate it with a product.
Order table was not selected so this mutator deals with creating a reorder instead, the reorder details are updated with dates, quantities and the connection to the products table.

![Alt text](images/4resolver.png?raw=true "Title")

The output of the modified relations

![Alt text](images/4output.png?raw=true "Title")
