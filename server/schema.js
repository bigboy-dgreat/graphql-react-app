export const typeDefs = `#graphql
   type Query {
   getUsers: [User]
   getUserById(id: ID): User
   }

type Mutation {
     createUser(name: String!, age: Int!, isMarried: Boolean!): User 
     updateUser(id: ID!, name: String, age: Int, isMarried: Boolean): User
     deleteUser(id: ID!): User
}

type User {
     id: ID
     name: String
     age: Int
     isMarried: Boolean
}
` 