<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand href="#" class="ms-3">
        <router-link to="/" class="navbar-brand">
          Easy Task
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/dashboard">Dashboard</b-nav-item>
          <b-nav-item href="/createtask">New Task</b-nav-item>
          <b-nav-item href="/allusers">User List</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto">
          <template v-if="username">
            <b-nav-item class="navbar-text">
              Hello, {{ username }}
            </b-nav-item>
            <b-nav-item @click="logout">Log Out</b-nav-item>
          </template>
          <template v-if="!username">
            <b-nav-item href="/login">Log In</b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>


<script setup lang="ts">
import { provide } from 'vue'
import { onMounted, ref } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
// import { currUserInfo } from './data'
import { getUsername } from './data'
import { useRouter } from 'vue-router'

const router = useRouter()

// const username = ref(null||String)
const username = ref<string | null>(null);

//changed
// const username = ref(null)

onMounted(async () => {
  const response = await getUsername()
  if (response.username) {
    username.value = response.username
  }
});

// function logout() {
//   window.location.href = '/logout'
// }

// Apollo Client Setup
const httpLink = createHttpLink({
  //uri: 'http://localhost:8888/graphql',
  uri: 'http://localhost:31000/api/graphql',
  fetchOptions: {
    credentials: 'include',
  },
})
const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

provide(DefaultApolloClient, apolloClient)


//logout
const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // 确保包含cookies等认证信息
    })
    if (response.ok) {
      // 登出成功，可能还要清除前端状态
      username.value = null
      // 这里重定向到登录页面
      router.push('/login')
    } else {
      // 登出失败的错误处理
      console.error('Logout failed')
    }
  } catch (error) {
    // 网络或其他错误处理
    console.error('Logout error', error)
  }
}

</script>

<!-- <style scoped>
.navbar-brand {
  color: white;
}

@media (max-width: 991.98px) {
  .navbar-brand {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .navbar-nav {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.ml-auto {
  margin-left: auto !important;
  padding-right: 1rem;
}
</style> -->
<style scoped>
.navbar-nav {
  align-items: center; /* Adjust vertical alignment */
}

/* If the text inside b-nav-item is not aligning correctly, force the vertical alignment */
.b-nav-item {
  display: flex;
  align-items: center;
}

/* Adjust for specific navbar text class if you have one */
.navbar-text {
  display: flex;
  align-items: center;
}
@media (max-width: 991.98px) {
  .navbar-brand {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .navbar-nav {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.ml-auto {
  margin-left: auto !important;
  padding-left: 1rem;
  padding-right: 1rem;
}
.navbar-nav {
  align-items: center;
}

.b-nav-item {
  display: flex;
  align-items: center;
}

.navbar-text {
  display: flex;
  align-items: center;
}
</style>
