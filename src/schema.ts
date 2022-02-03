import { gql } from 'apollo-server'

export const typeDefs = gql`
type Query {
    hello: String!
    posts: [Post!]!
}

type User {
    id: ID!     
    email: String!   
    name: String!   
    posts: [Post!]!    
    profile: Profile!
}

type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
}

type Post {
    id: ID!      
    title: String!   
    content: String!   
    published: Boolean!
    createdAt: String!
    user: User!
}

type Profile {
    id: ID!      
    bio: String!   
   user: User!
}

type UserError {
    message: String!
}

type PostPayload {
    userErrors: [UserError!]!
    post: Post
}

input PostInput {
    title: String
    content: String
}
`

