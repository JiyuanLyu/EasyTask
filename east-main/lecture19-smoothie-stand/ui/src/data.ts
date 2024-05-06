// import gql from "graphql-tag"

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

export interface TaskCreationInfo {
  name: string
  description: string
  dueDay: Date
  priority: 1 | 2 | 3
  isRecur: boolean
  recurPeriod?: "weekly" | "monthly" | "yearly"
  memberList: string[] // 应存储用户的ID或唯一标识符
  owner: string // 任务拥有者的用户ID或唯一标识符
}

export interface TaskCreationResponse {
  message: string
  taskId?: string
  error?: string
  success?: string
}

export async function createTask(
  taskInfo: TaskCreationInfo
): Promise<TaskCreationResponse> {
  try {
    // 如果任务是重复的，处理重复任务的逻辑
    if (taskInfo.isRecur) {
      const startDate = new Date(taskInfo.dueDay)
      const endDate = new Date(startDate)
      endDate.setFullYear(startDate.getFullYear() + 1) // 设置重复结束日期为一年后
    }

    const response = await fetch("/api/create-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${yourAuthToken}`  // 如果需要
      },
      body: JSON.stringify(taskInfo),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        message: "Task creation failed",
        error: errorData.message || "An error occurred during task creation",
      }
    }

    const data = await response.json()
    return {
      message: "Task created successfully",
      taskId: data.taskId,
      success: data.message,
    }
  } catch (error) {
    console.error("Error creating task:", error)
    return {
      message: "Task creation failed",
      error: "Failed to connect to the server",
    }
  }
}

// 在 data.ts 中添加一个新函数来搜索用户

export interface UserSearchResponse {
  message: string
  users?: string[] // 根据搜索返回的用户列表
  error?: string
}

export async function searchUsers(query: string): Promise<UserSearchResponse> {
  try {
    const response = await fetch(
      `/api/search-users?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${yourAuthToken}`, // 如果需要
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        message: "User search failed",
        error: errorData.message || "An error occurred during user search",
      }
    }

    const data = await response.json()
    return {
      message: "User search successful",
      users: data,
    }
  } catch (error) {
    console.error("Error searching users:", error)
    return {
      message: "User search failed",
      error: "Failed to connect to the server",
    }
  }
}

// get the user info (name and roles)
export interface UsernameResponse {
  username: string | null
  message: string
  error?: string
}

export async function getUsername(): Promise<UsernameResponse> {
  try {
    const response = await fetch("/api/get-username", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        username: null,
        message: "Failed to fetch username",
        error:
          errorData.message ||
          "An error occurred while trying to fetch the username",
      }
    }

    const data = await response.json()
    return {
      username: data.username,
      message: "Username fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching username:", error)
    return {
      username: null,
      message: "Failed to fetch username",
      error: "Failed to connect to the server",
    }
  }
}

export interface RolesResponse {
  roles: string[] | null
  message: string
  error?: string
}

export async function getRoles(): Promise<RolesResponse> {
  try {
    const response = await fetch("/api/get-roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        roles: null,
        message: "Failed to fetch roles",
        error:
          errorData.message ||
          "An error occurred while trying to fetch the roles",
      }
    }

    const data = await response.json()
    return {
      roles: data.roles,
      message: "Roles fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching roles:", error)
    return {
      roles: null,
      message: "Failed to fetch roles",
      error: "Failed to connect to the server",
    }
  }
}
