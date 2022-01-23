const { gql } = require("apollo-server");

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

module.exports = typeDefs;
