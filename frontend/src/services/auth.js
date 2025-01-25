import { API_ENDPOINTS, AUTH_STORAGE_KEYS, TOAST_MESSAGES } from '../constants';

class AuthService {
  static async login(email, password) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || TOAST_MESSAGES.LOGIN_ERROR);
      }

      const data = await response.json();
      this.setTokens(data.access, data.refresh);
      this.setUser(data.user);
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError') {
        throw new Error(TOAST_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  static async logout() {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        console.error('Logout failed on server');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  static async refreshToken() {
    try {
      const refresh = this.getRefreshToken();
      if (!refresh) throw new Error(TOAST_MESSAGES.SESSION_EXPIRED);

      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) throw new Error(TOAST_MESSAGES.SESSION_EXPIRED);

      const data = await response.json();
      this.setTokens(data.access, refresh);
      return data.access;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  static setTokens(access, refresh) {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, access);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refresh);
  }

  static setUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getAccessToken() {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  }

  static getRefreshToken() {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }

  static getUser() {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static clearAuth() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  }

  static isAuthenticated() {
    return !!this.getAccessToken();
  }
}

export default AuthService; 