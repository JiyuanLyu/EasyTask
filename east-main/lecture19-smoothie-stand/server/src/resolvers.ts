import { User, Task } from "../data"
import { Collection } from "mongodb"

interface Context {
  user: User | null
  tasksCollection: Collection<Task>
  usersCollection: Collection<User>
}

export const resolvers = {
  Query: {
    getUserTasks: async (
      _: any,
      __: any,
      { user, tasksCollection }: Context
    ) => {
      console.log("enter getUserTasks function")
      console.log(user)
      if (!user) {
        throw new Error("Unauthorized")
      }
      return await tasksCollection.find({ memberList: user.username }).toArray()
    },
    getAllUsers: async (
      _: any,
      __: any,
      { user, usersCollection }: Context
    ) => {
      console.log("enter getAllUsers function")
      console.log(user)
      if (!user || !user.roles.includes("admin")) {
        console.log("enter this if")
        throw new Error("Unauthorized")
      }
      const allUsers = await usersCollection.find().toArray()

      console.log("Fetched all users:", allUsers)

      return allUsers
    },
  },
}
