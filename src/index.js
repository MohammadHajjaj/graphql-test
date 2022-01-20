const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const typeDefs = gql`
  type Mutation {
    createUser(data: CreateUserInput!): User!
    login(data: LoginUserInput!): User!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String
  }

  type Query {
    users: [User!]
  }
`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
  },
  Mutation: {
    createUser: async (_parent, { data }) => {
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
        },
      });
      return user;
    },
    login: async (_parent, { data }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      const valid =
        user && (await bcrypt.compare(data.password, user.password));

      if (!valid) {
        throw new Error("Incorrect email or password");
      }

      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
