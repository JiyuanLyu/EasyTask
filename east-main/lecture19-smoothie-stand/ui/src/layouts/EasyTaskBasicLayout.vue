<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <!-- Brand -->
                <a class="navbar-brand" href="/">EasyTask</a>

                <!-- Toggler for mobile view -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Navbar content -->
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        <!-- Conditional rendering based on login state -->
                        <li class="nav-item" v-if="!isLoggedIn">
                            <router-link class="nav-link" to="/easytask/register">Register/Log in</router-link>
                        </li>
                        <li class="nav-item" v-else>
                            <button class="nav-link btn" @click="logout">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <router-view />
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup() {
        const isLoggedIn = ref(false)
        const logout = () => {
            isLoggedIn.value = false
        }

        return {
            isLoggedIn,
            logout
        }
    }
}
</script>

<style>
</style>
