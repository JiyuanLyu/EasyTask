import { MongoClient } from "mongodb"
import { User, Task } from "./data"

// Connection URL
//changed
const url = "mongodb://localhost:27017/easytask"
// const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/easytask';
const client = new MongoClient(url)

async function main() {
  try {
    await client.connect()
    console.log("Connected successfully to MongoDB")

    const db = client.db("easytask")

    // Insert user data
    const user: User = {
      username: "insert test user",
      roles: ["admin"],
      taskIDList: [],
    }
    const insertedUser = await db.collection("users").insertOne(user)
    console.log(`Inserted user: ${user.username}`)

    // Insert task data
    const task: Task = {
      name: "test mongodb graphql",
      description: "This is task one",
      dueDay: new Date(),
      priority: "High",
      isRecur: false,
      memberList: ["jl1230"],
      owner: "jl1230",
      status: "pending",
      uniqueTaskID: "uniqueTaskId_001",
    }

    const insertedTask = await db.collection("tasks").insertOne(task)
    console.log(`Inserted task: ${task.name}`)
  } catch (error) {
    console.error("Error connecting to MongoDB", error)
  } finally {
    await client.close()
  }
}

main()
