import { defineStore } from 'pinia';
import axios from 'axios';
import AuthRepository from '@/repositories/auth.repository.js'

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('token') || null,

  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    async loginWithGoogle() {
      const authRepository = new AuthRepository()
      const response = await authRepository.loginWithGoogle()

      if (response) {
        if(response.error){
          this.googleMessageError = response.error
          return false
        }

        if(response.token && response.user) {
          this.token = response.token
          this.user = response.user
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
          return true
        }

      } else {
        return false
      }

    },

    async loginWithCredentials(payload) {
      const authRepository = new AuthRepository()
      try {
        const response = await authRepository.loginWithCredentials(payload)

        if (response.success) {
          this.token = response.data.token
          this.user = response.data.user
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
          return true
        } else {
          console.error('Login failed:', response.error);
          return false
        }
      } catch (error) {
        console.error('Error during login:', error);
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    initializeAuth() {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user"))
      if (token && user) {
        this.token = token
        this.user = user
      }
    },



    clearAuth() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});