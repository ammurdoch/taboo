const { gql } = require('apollo-server-express');

export default gql`
  type Query {
    "A simple type for getting started!"
    hello: String
    bank(id: ID!): BankAccountNode
    allBankAccounts(
      first: Int
      after: String
      filters: BankAccountFilters
    ): BankAccountConnection!
  }

  type Mutation {
    signUp(uid: ID!, email: String!, password: String!): UserNode
    updateProfile(profile: UpdateProfileInput): UserNode
    createBankAccount(bankAccount: BankAccountCreateInput!): BankAccountNode!
    updateBankAccount(bankAccount: BankAccountUpdateInput!): BankAccountNode!
    deleteBankAccount(id: ID!): ID!
  }

  scalar Date
  scalar DateTime
  scalar Cursor

  type PageInfo {
    hasPreviousPage: Boolean
    hasNextPage: Boolean
    startCursor: Cursor
    endCursor: Cursor
  }

  type UserNode {
    uid: ID!
    name: String
    email: String
    phoneNumber: String
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
    phoneNumber: String
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

  type BankAccountNode {
    id: ID!
    owner: ID!
    label: String!
    verificationStatus: String!
    createdBy: ID!
    updatedBy: ID!
    createdAt: Date
    updatedAt: Date
  }

  type BankAccountEdge {
    cursor: Cursor
    node: BankAccountNode!
  }

  type BankAccountConnection {
    edges: [BankAccountEdge]!
    pageInfo: PageInfo!
    totalCount: Int
  }

  input BankAccountFilters {
    label: String
  }

  input BankAccountCreateInput {
    id: ID!
    owner: ID!
    label: String!
    routingNo: String!
    accountNo: String!
  }

  input BankAccountUpdateInput {
    id: ID!
    label: String
  }
`;
