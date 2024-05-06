<template>
  <div class="login-container">
    <div class="login-content">
      <h1>Welcome to EasyTask</h1>
      <p>Please login via GitLab for further using.</p>
      <button class="login-button" variant="primary" @click="gitlabLogin">Login with GitLab</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gitlabLogin() {
      window.location.href = '/api/login'
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-content {
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  color: #666;
}

.login-button {
  background-color: #497bee;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.login-button:hover,
.login-button:focus {
  background-color: #2f44bf;
}
</style>
