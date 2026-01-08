import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema.js";
import db from './_db.js';

const resolvers = {
      Query: {
            getUsers: () => {
                  return db.users;
            },
            getUserById: (_, args) => {
                  const id = args.id;
                  return db.users.find((u) => u.id === id);
            }
      },
      Mutation: {
            createUser: (_, args) => {
                  const { name, age, isMarried } = args;
                  const newUser = {
                        id: (db.users.length + 1).toString(),
                        name,
                        age,
                        isMarried,
                  };
                  db.users.push(newUser)
                  return newUser;
            },
            updateUser: (_, args) => {
                  const { id, name, age, isMarried } =args;
                  const userIndex = db.users.findIndex(u => u.id === id);
                  if (userIndex === -1) return null;

                  db.users[userIndex] = {
                        ...db.users[userIndex],
                        name,
                        age,
                        isMarried,
                  };
                  
                  return db.users[userIndex];
            },
            deleteUser: (_, { id }) => {
                  const index = db.users.findIndex(u => u.id === id)
                  if (index === -1) return null

                  const deleted = db.users[index]
                  db.users.splice(index, 1)

                  return deleted
            }
      }
}

const server = new ApolloServer ({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
      listen: { port: 5000},
});

console.log(`Server is Running at: ${ url }`)