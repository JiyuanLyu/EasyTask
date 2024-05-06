import express from "express"
import bodyParser from "body-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"
import { Issuer, Strategy, generators } from "openid-client"
import { Strategy as CustomStrategy } from "passport-custom"
import { MongoClient, Collection, Db, ObjectId } from "mongodb"
import { ApolloServer } from "apollo-server-express"
import { gitlab } from "./secrets"
import { typeDefs } from "./src/schema.graphql"
import { resolvers } from "./src/resolvers"
import { User, Task } from "./data"
// import axios from "axios"
import cors from "cors"
// import pino from "pino"
// import expressPinoLogger from "express-pino-logger"

const port = 8888
//changed
// const mongoUrl = "mongodb://localhost:27017/easytask"
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/easytask';
const client = new MongoClient(mongoUrl)

//chaned
const DISABLE_SECURITY = "disable"

const passportStrategies = [
  ...(DISABLE_SECURITY ? ["disable-security"] : []),
  "oidc",
]



let db: Db
let users: Collection<User>
let tasks: Collection<Task>

async function connectToMongoDB() {
  await client.connect()
  console.log(`Connected successfully to MongoDB: ${mongoUrl}`)
  db = client.db("easytask")
  users = db.collection("users")
  tasks = db.collection("tasks")
}

async function configureOIDC() {
  try {
    const gitlabIssuer = await Issuer.discover(
      "https://coursework.cs.duke.edu/"
    )
    const oidcClient = new gitlabIssuer.Client(gitlab)

    const params = {
      scope: "openid profile email",
      nonce: generators.nonce(),
      // redirect_uri: "http://localhost:8080/easytask/login-callback",
      // redirect_uri: "http://localhost:31000/easytask/login-callback",
      redirect_uri: "http://localhost:31000/api/login-callback",
      state: generators.state(),
    }

    passport.use(
      "oidc",
      new Strategy({ client: oidcClient, params }, oidcVerifyCallback)
    )

    passport.use("disable-security", new CustomStrategy((req, done) => {
      if (req.query.key !== DISABLE_SECURITY) {
        console.log("you must supply ?key=" + DISABLE_SECURITY + " to log in via DISABLE_SECURITY")
        done(null, false)
      } else {
        done(null, { username: req.query.user, roles: [].concat(req.query.role) })
      }
    }))

  } catch (err) {
    console.error("OIDC Discovery Failed:", err)
  }
}

async function oidcVerifyCallback(tokenSet: any, profile: any, done: any) {
  // console.log("enter oidcVerifyCallback()", tokenSet, profile)
  if (!users) throw new Error("Database not initialized")

  // const accessToken = tokenSet.access_token
  const username = profile.preferred_username

  const groups = profile.groups
  const adminGroup = "easy-task-devs"
  const isAdmin = await groups.includes(adminGroup)

  const roles = isAdmin ? ["admin"] : ["client"]
  try {
    const user = await users.findOneAndUpdate(
      { username },
      { $set: { username, roles } }, //, token: accessToken } },
      { upsert: true, returnDocument: "after" } as any
    )
    console.log("done", user)
    done(null, user)
  } catch (error) {
    console.log("Error: oidcVerifyCallback", error)
    done(error)
  }
  console.log("Done oidcVerifyCallback")
}

const app = express()

const corsOptions = {
  //changed
  // origin: "http://localhost:8080",
  origin: "http://localhost:31000",
  credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: "easytask_secret_key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: { secure: false },
  })
)
declare module "express-session" {
  export interface SessionData {
    user?: {
      username: string
      token: string
      roles: string[]
    }
  }
}

app.use(passport.initialize())
app.use(passport.session())
// passport.serializeUser((user: any, done) => {
//   console.log("serializeUser", user)
//   done(null, user)
// })

passport.serializeUser((user: any, done) => {
  // console.log("serializeUser here:", user)
  const sessionUser = {
    username: user.username,
    roles: user.roles,
  }
  // console.log("sessionUser here:", sessionUser)
  done(null, sessionUser)
})

passport.deserializeUser((user: any, done) => {
  // console.log("deserializeUser", user)
  done(null, user)
})
// const logger = pino({ transport: { target: "pino-pretty" } })
// app.use(expressPinoLogger({ logger }))

connectToMongoDB().then(() => {
  configureOIDC()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      db,
      user: req.user,
      tasksCollection: db.collection("tasks"),
      usersCollection: db.collection("users"),
    }),
    formatError: (err) => {
      console.error(err)
      return err
    },
  })


  server.start().then(() => {
    server.applyMiddleware({ app, path: "/api/graphql", cors: false })
    app.listen(port, () => {
      console.log(
        `Server running on http://localhost:${port}${server.graphqlPath}`
      )
    })
  })
})

app.get("/api/login", passport.authenticate(passportStrategies, {failureRedirect:"/login"}),(req, res) => {res.redirect("/")})

app.get(
  //changed
  // "/easytask/login-callback",
  "/api/login-callback",
  passport.authenticate(passportStrategies, { failureRedirect: "/login" }),
  (req, res) => {
    console.log("login-callback: ", req.user)
    if (req.user) {
      //changed
      // res.redirect("http://localhost:8080/easytask/dashboard")
      res.redirect("http://localhost:31000/easytask/dashboard")
    } else {
      res.redirect("/login")
    }
  }
)

app.post("/api/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      console.log("logout called")
      if (err) {
        return res
          .status(500)
          .json({ message: "Could not log out, please try again" })
      }
      // res.clearCookie("connect.sid")
      res.redirect("/login")
    })
  })
})

app.get("/api/verify-session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: "User is logged in" })
  } else {
    res.status(401).json({ message: "User does not log in" })
  }
})

//create task
const { v4: uuidv4 } = require("uuid")

app.post("/api/create-task", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    // 如果用户没有通过认证，返回401状态码
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log("/create-task", req.user)
  const authUser = req.user as any
  const {
    name,
    description,
    dueDay,
    priority,
    isRecur,
    recurPeriod,
    memberList,
    // owner,
  } = req.body

  const groupTaskID = uuidv4()
  let tasksToInsert: Task[] = []
  const startDate = new Date(dueDay)
  const endDate = new Date(startDate)
  endDate.setFullYear(startDate.getFullYear() + 1)
  const ownerUsername = authUser.username
  const newMemberList = Array.from(new Set([...memberList, ownerUsername]))

  if (isRecur) {
    let currentDate = new Date(startDate)
    let loopCounter = 0 // 初始化循环计数器

    while (currentDate <= endDate) {
      loopCounter++ // 增加计数器

      tasksToInsert.push({
        name,
        description,
        dueDay: new Date(currentDate),
        priority,
        isRecur,
        recurPeriod,
        memberList: newMemberList,
        owner: ownerUsername,
        status: "pending", // 确保这里的值符合 Task接口
        groupTaskID,
        uniqueTaskID: uuidv4(),
      })

      switch (recurPeriod) {
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7)
          break
        case "monthly":
          const oldMonth = currentDate.getMonth()
          currentDate.setMonth(currentDate.getMonth() + 1)
          // 如果没有相应的日子，会跳到下个月，比如7月31日加一个月会变成9月1日
          if (currentDate.getMonth() !== (oldMonth + 1) % 12) {
            currentDate.setDate(0) // 回到上个月的最后一天
          }
          break
        case "yearly":
          const oldDate = currentDate.getDate()
          currentDate.setFullYear(currentDate.getFullYear() + 1)
          // 如果是闰年的2月29日，增加一年后检查日期是否改变，如果是则回到2月的最后一天
          if (currentDate.getDate() !== oldDate) {
            currentDate.setMonth(1) // 2月
            currentDate.setDate(29) // 这会自动回到2月的最后一天，无论是否是闰年
          }
          break
      }
      console.log(
        `Current date: ${currentDate.toISOString()}, loop count: ${loopCounter}`
      )
    }

    console.log(`Entered the while loop ${loopCounter} times`) // 打印循环次数
  } else {
    tasksToInsert.push({
      name,
      description,
      dueDay: new Date(dueDay),
      priority,
      isRecur,
      recurPeriod: undefined,
      memberList: newMemberList,
      owner: ownerUsername,
      status: "pending",
      groupTaskID,
      uniqueTaskID: uuidv4(),
    })
  }

  try {
    const result = await tasks.insertMany(tasksToInsert)
    res.status(201).json({
      message: "Task(s) created successfully!",
      taskCount: result.insertedCount,
    })
  } catch (error) {
    console.error("Failed to create task(s)", error)
    res.status(500).json({ message: "Failed to create task(s)." })
  }
})

app.get("/api/search-users", async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    // 如果用户没有通过认证，返回401状态码
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log("/search-users", req.user)
  const searchQuery = req.query.q
  if (!searchQuery || typeof searchQuery !== "string") {
    return res.status(400).json({ message: "Query is required." })
  }

  try {
    const searchResult = await users
      .find({
        username: { $regex: searchQuery, $options: "i" },
      })
      .toArray()

    if (searchResult.length === 0) {
      // 没有匹配到任何用户时返回的消息
      res.status(200).json(["No matches found"])
    } else {
      // 返回一个包含完整用户信息的对象数组
      res.status(200).json(
        searchResult.map((user) => {
          return {
            //id: user._id.toString(), // 转换为字符串
            username: user.username,
            //email: user.email,
          }
        })
      )
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error searching for users." })
  }
})

app.get("/api/get-username", (req, res) => {
  // console.log("/get-username called", req.user)

  if (req.isAuthenticated() && req.user) {
    const authUser = req.user as any
    res.status(200).json({ username: authUser.username })
  } else {
    res.status(401).json({ message: "User not authenticated" })
  }
})

app.get("/api/get-roles", (req, res) => {
  console.log("/get-roles called", req.user)

  if (req.isAuthenticated() && req.user) {
    const authUser = req.user as any
    res.status(200).json({ roles: authUser.roles })
  } else {
    res.status(401).json({ message: "User not authenticated" })
  }
})
