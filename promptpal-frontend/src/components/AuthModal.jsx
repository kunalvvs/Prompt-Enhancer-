import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from './GoogleSignIn';

const AuthModal = ({ isOpen, onClose, mode, onToggleMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { login, register, googleLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.username, formData.email, formData.password);
      }

      if (result.success) {
        if (result.requiresVerification) {
          setShowVerificationMessage(true);
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          setErrors({});
        } else {
          onClose();
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          setErrors({});
          // Refresh the page to load user data
          window.location.reload();
        }
      } else {
        if (result.requiresVerification) {
          setShowVerificationMessage(true);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (data) => {
    try {
      const result = await googleLogin(data);
      if (result.success) {
        onClose();
        // Refresh the page to load user data and history
        window.location.reload();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Google sign-in failed' });
    }
  };

  const handleGoogleError = (error) => {
    setErrors({ general: error });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-slide-up max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {mode === 'login' 
                ? 'Sign in to access your prompt history' 
                : 'Join Prompt Elevate to save your prompts'
              }
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs sm:text-sm">{errors.general}</p>
            </div>
          )}

          {/* Verification Message */}
          {showVerificationMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Check your email!</p>
              </div>
              <p className="text-blue-600 text-xs sm:text-sm mt-1">
                We've sent a verification link to your email address. Please click the link to verify your account.
              </p>
            </div>
          )}

          {/* Google Sign-In */}
          {!showVerificationMessage && (
            <>
              <GoogleSignIn 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={loading}
              />
              
              <div className="flex items-center my-4 sm:my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500 bg-white">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            </>
          )}

          {/* Form */}
          {!showVerificationMessage && (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
            {mode === 'register' && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          )}

          {/* Toggle Mode */}
          {!showVerificationMessage && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={onToggleMode}
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
