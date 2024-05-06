import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type User {
    username: String!
    roles: [String]!
  }

  type Task {
    name: String!
    description: String
    dueDay: String!
    priority: String!
    memberList: [String]!
    owner: String!
    status: String!
    uniqueTaskID: String!
  }

  type Query {
    getUserTasks: [Task]
    getAllUsers: [User]
  }
`
