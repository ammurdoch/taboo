const { gql } = require("apollo-server-express");

export default gql`
type Query {
  "A simple type for getting started!"
  hello: String
}

type Mutation {
  signUp(
    uuid: ID!
    email: String!
    password: String!
  ): User
}

type User {
  name: String
  email: String
}
`;
