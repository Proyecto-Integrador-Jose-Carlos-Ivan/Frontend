import { defineStore } from 'pinia';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
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
    async logout() {
        try {
          await axios.post('http://localhost/api/logout', {}, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.token = null;
          this.user = null;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (error) {
          console.error('Error during logout:', error);
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