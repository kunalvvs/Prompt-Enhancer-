import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/auth/profile');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true,
          error: response.data.error 
        };
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      return { 
        success: false, 
        requiresVerification: errorData?.requiresVerification || false,
        error: errorData?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/auth/register', {
        username,
        email,
        password
      });

      if (response.data.requiresVerification) {
        return { 
          success: true, 
          requiresVerification: true,
          message: response.data.message 
        };
      }

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const googleLogin = async (data) => {
    try {
      // Token and user data are already provided from the Google auth response
      const { token, user } = data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Google sign-in failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
