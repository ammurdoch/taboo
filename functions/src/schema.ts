const { gql } = require("apollo-server-express");

export default gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }

  type Mutation {
    signUp(
      uid: ID!
      email: String!
      password: String!
    ): UserNode
    updateProfile(profile: UpdateProfileInput): UserNode
  }

  scalar Date
  scalar DateTime

  type UserNode {
    uid: ID!
    name: String
    email: String
    phone: String
    birthday: Date
    profilePicUrl: String
    createdBy: ID!
    updatedBy: ID!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input UpdateProfileInput {
    uid: ID!
    name: String
    email: String
    phone: String
    birthday: Date
    profilePicId: ID
  }

  type ImageFile {
    id: ID!
    s3Key: String!
    size: Float!
    filename: String!
    contentType: String!
  }

  type ImageNode {
    id: ID!
    filename: String!
    desc: String
    original: ImageFile!
    sm: ImageFile
    md: ImageFile
    lg: ImageFile
    tags: [String]
    permissions: [String]
    createdBy: ID!
    updatedBy: ID!
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
