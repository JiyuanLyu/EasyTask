<!-- <template>
  <div>
    <h1>All Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="users">
      <div v-for="user in users" :key="user.username" class="user-box">
        <h2>{{ user.username }}</h2>
        <p>Roles: {{ user.roles.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
// 
// Define the GraphQL query to fetch all users.
const { result, loading } = useQuery(gql`
  query GetAllUsers {
    getAllUsers {
      username
      roles
    }
  }
`)
const users = ref([])
result.value && (users.value = result.data.getAllUsers)
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 1rem;
}

.user-box {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.user-box h2 {
  margin-top: 0;
}

p {
  margin: 0.5rem 0;
  color: #666;
}
</style> -->

<!-- <template>
  <div>
    <h1>All Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error.message }}</div>
    <div v-if="isAdmin">
      <div v-for="user in users" :key="user.username" class="user-box">
        <h2>{{ user.username }}</h2>
        <p>Roles: {{ user.roles.join(', ') }}</p>
      </div>
    </div>
    <div v-else>
      <p>You are not authorized to view this page.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { getRoles } from '../data' // Make sure the path is correct
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  name: 'AllUsers',
  setup() {
    const roles = ref([])
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Computed property to check if the user is an admin
    const isAdmin = computed(() => roles.value.includes('admin'))

    // Function to fetch users using GraphQL query
    function fetchUsers() {
      const { result, loading: queryLoading, error: queryError } = useQuery(gql`
        query GetAllUsers {
          getAllUsers {
            username
            roles
          }
        }
      `)

      // Watch the result of the query to update the users list
      watchEffect(() => {
        if (result.value) {
          users.value = result.value.getAllUsers
        }
      })

      // Assign the loading and error states
      loading.value = queryLoading.value
      error.value = queryError.value
    }

    // Initial fetch for roles
    loading.value = true
    getRoles()
      .then((rolesResponse) => {
        roles.value = rolesResponse.roles
        if (isAdmin.value) {
          fetchUsers()
        } else {
          throw new Error('You do not have the necessary permissions.')
        }
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })

    return {
      isAdmin,
      users,
      loading,
      error
    }
  },
}
</script>

<style scoped>
/* existing styles */
</style> -->
<template>
  <div>
    <h1>All Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div v-else>
      <div v-for="user in users" :key="user.username" class="user-box">
        <h2>{{ user.username }}</h2>
        <p>Roles: {{ user.roles.join(', ') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const users = ref([])
const loading = ref(true)
const error = ref(null)

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      username
      roles
    }
  }
`

const { result, loading: queryLoading, error: queryError } = useQuery(GET_ALL_USERS)

// Watch for changes in the GraphQL query result
watch(result, (newVal) => {
  if (newVal?.getAllUsers) {
    users.value = newVal.getAllUsers
  }
})

// Update loading and error states
watch(queryLoading, (newLoading) => {
  loading.value = newLoading
})

watch(queryError, (newError) => {
  if (newError) {
    error.value = newError
  }
})
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 1rem;
}

.user-box {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.user-box h2 {
  margin-top: 0;
}

p {
  margin: 0.5rem 0;
  color: #666;
}
</style>
