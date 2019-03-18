/*
This is this part of the tutorial.
https://www.prisma.io/docs/get-started/03-build-graphql-servers-with-prisma-JAVASCRIPT-e001/

NOTE: the tutorial he linke(the one above) is different from part three if you had just followed
along from part 1

*/

const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')



const resolvers = {
  Query: {
    publishedPosts(root, args,  context){
      return context.prisma.posts({ where:{ published : true }})
    },
    post(root,args,context){
      return context.prisma.post({ id:args.PostId})
    },
    postsByUser(root,args,context){
      return context.prisma.user({
        id:args.userId
      }).posts()
    }
  },
  Mutation:{
    createDraft(root,args,context){
      return context.prisma.createPost(
        {
          title: args.title,
          author: {
            connect: {id: args.userId}
          }
        }
      )
    },
    publish(root,args,context){
      return context.prisma.updatePost(
        {
          where: {id:args.postId},
          data: {published: true}
        }
      )
    },
    createUser(root, args, context){
      return context.prisma.createUser(
        { name : args.name }
      )
    }
  },
  //These two are like a sql relationship. A user has posts and a post has author(User)
  //Look at schema.graphql. Notice that you dont do the name, email etc, just the relationship
  User: {
    posts(root,args,context){
      return context.prisma.user({
        id: root.id
      }).posts()
    }
  },
  Post: {
    author(root, args,context){
      return context.prisma.post({
        id: root.id
      }).author()
    }
  }
}


//Configure the GraphQL server
const server = new GraphQLServer({
  typeDefs:'./schema.graphql',
  resolvers,
  context: {
    prisma
  }
})


server.start(() => console.log("Server is running on http://localhost:4000"))