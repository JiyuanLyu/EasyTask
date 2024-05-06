import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import App from "./App.vue"
import Login from "./views/Login.vue"
import Dashboard from "./views/Dashboard.vue"
import CreateTask from "./views/CreateTask.vue"
import AllUsers from "./views/AllUsers.vue"

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/createtask",
    component: CreateTask,
    meta: { requiresAuth: true },
  },
  {
    path: "/allusers",
    component: AllUsers,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory("/easytask/"),
  // history: createWebHistory(""),
  routes,
})

// createApp(App).use(BootstrapVue3).use(router).mount("#app")
createApp(App)
  .use(BootstrapVue as any)
  .use(BootstrapVueIcons as any)
  .use(router)
  .mount("#app")
