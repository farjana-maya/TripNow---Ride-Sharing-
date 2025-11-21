import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Navigation } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Check if response is successful (status 200-299)
      if (response.ok && data.success) {
        // Store auth data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Store notification count for admins
        if (data.notification_count !== undefined) {
          localStorage.setItem('notification_count', data.notification_count);
        }

        // Role-based routing with driver verification check
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'driver') {
          // Check if driver has submitted info and is approved
          await checkDriverStatus(data.token, data.user);
        } else {
          // Regular user
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        }
      } else {
        // Handle error responses (401, 422, 403, etc.)
        if (response.status === 401) {
          setApiError('Invalid username or password. Please check your credentials and try again.');
        } else if (response.status === 403) {
          setApiError(data.message || 'Your account has been deactivated. Please contact support.');
        } else if (response.status === 422) {
          // Validation errors
          if (data.errors) {
            // Display first validation error
            const firstError = Object.values(data.errors)[0];
            setApiError(Array.isArray(firstError) ? firstError[0] : firstError);
          } else {
            setApiError(data.message || 'Validation failed. Please check your input.');
          }
        } else {
          setApiError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateDriverStatus = async (token, status) => {
    try {
      await fetch('http://localhost:8000/api/driver/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Failed to update driver status:', error);
    }
  };

  const checkDriverStatus = async (token, user) => {
    try {
      const response = await fetch('http://localhost:8000/api/driver/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Failed to check driver status:', data.message);
        navigate('/driver-form');
        return;
      }

      // Handle different driver statuses
      if (!data.has_submitted) {
        // Driver hasn't submitted info yet - redirect to form
        navigate('/driver-form');
      } else if (data.driver.status === 'pending') {
        // Driver info submitted but pending approval
        navigate('/driver/pending');
      } else if (data.driver.status === 'rejected') {
        // Driver was rejected
        navigate('/driver/rejected', { state: { driver: data.driver } });
      } else if (data.driver.status === 'approved' || data.driver.status === 'online' || data.driver.status === 'offline') {
        // Driver is approved - set online status and access dashboard
        await updateDriverStatus(token, 'online');
        navigate('/driver/dashboard');
      } else {
        console.error('Unknown driver status:', data.driver.status);
        navigate('/driver-form');
      }
    } catch (error) {
      console.error('Error checking driver status:', error);
      navigate('/driver-form');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl shadow-lg"></div>
              <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                <Navigation className="text-emerald-500 transform rotate-45" size={24} />
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              TripNow
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700 font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Enter your username or email"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.username}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-500 font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-emerald-600 hover:text-emerald-500 font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Driver Registration CTA */}
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
            <p className="text-sm text-gray-700 text-center">
              Want to drive and earn?{' '}
              <button
                onClick={() => navigate('/drive')}
                className="text-emerald-600 hover:text-emerald-500 font-bold hover:underline"
              >
                Register as Driver
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;