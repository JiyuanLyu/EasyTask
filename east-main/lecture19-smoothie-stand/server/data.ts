// data.ts

export const possiblePriorityLevels = ["Low", "Medium", "High"]

export interface User {
  username: string
  taskIDList?: string[]
  roles: string[]
}

export interface Task {
  name: string
  description?: string
  dueDay: Date
  recurEndDay?: Date
  priority: "Low" | "Medium" | "High"
  isRecur: boolean
  recurPeriod?: "weekly" | "monthly" | "yearly"
  memberList: string[]
  owner: string
  status: "pending" | "complete" | "closed" | "passed"
  groupTaskID?: string
  uniqueTaskID: string
}
