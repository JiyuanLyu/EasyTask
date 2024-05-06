import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      vue: "@vue/compat",
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],

  server: {
    port: 8080,
    proxy: {
      //changed
      // "/easytask/login-callback": "http://localhost:8888",
      // "^/easytask/login-callback": {
      //   target: "http://localhost:8888",
      //   changeOrigin: true,
      //   secure: false,
      // },
      "^/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
