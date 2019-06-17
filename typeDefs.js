const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
    admin: Boolean
  }

  type Pin {
    _id: String,
    createdAt: String,
    title: String,
    content: String,
    image: String,
    latitude: Float,
    longitude: Float,
    eventDate: String,
    link: String,
    author: User
    comments: [Comment]
  }

  type Comment {
    _id: String,
    text: String,
    createdAt: String,
    author: User
  }

  input CreatePinInput {
    title: String
    image: String
    content: String
    latitude: Float
    longitude: Float
    eventDate: String
    link: String,
    _id: ID
  }

  type Query {
    me: User
    getPins: [Pin!]
  }

  type Mutation {
    createPin(input: CreatePinInput!): Pin
    createComment(pinId: ID!, text: String!): Pin
    deleteComment(pinId: ID!, commentId: String!): Pin
    deletePin(pinId: ID!): Pin
  }

  type Subscription {
    pinAddedSubscribe: Pin
    pinEditedSubscribe: Pin
    pinUpdatedSubscribe: Pin
    pinDeletedSubscribe: Pin
    deleteCommentSubscribe: Pin
  }
`