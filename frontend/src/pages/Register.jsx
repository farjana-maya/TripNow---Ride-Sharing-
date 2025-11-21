import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Car, UserCircle, ArrowRight, CheckCircle, Navigation } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if coming from drive page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromDrive = urlParams.get('driver');
    if (fromDrive === 'true') {
      setFormData(prev => ({ ...prev, role: 'driver' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.role === 'driver' && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for drivers';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Store token and user data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Show success message
        alert(`Registration successful! ${formData.role === 'driver' ? 'Please fill out your driver profile information.' : 'Welcome to TripNow!'}`);

        // Redirect based on role
        if (formData.role === 'driver') {
          window.location.href = '/driver-form';
        } else {
          window.location.href = '/';
        }
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
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
          <h2 className="text-2xl font-bold text-gray-900">
            {formData.role === 'driver' ? 'Become a Driver' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {formData.role === 'driver' 
              ? 'Start earning on your own schedule' 
              : 'Join thousands of happy riders'}
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Role Selection */}
          <div className="flex space-x-3 mb-6 bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                formData.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCircle size={20} />
              <span>Rider</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                formData.role === 'driver'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car size={20} />
              <span>Driver</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`text-black w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`text-black w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Choose a unique username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`text-black w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Field (Required for drivers) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number {formData.role === 'driver' && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`text-black w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="+880 1234-567890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                  className={`text-black w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>{formData.role === 'driver' ? 'Continue to Driver Form' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-emerald-500 font-semibold hover:text-emerald-600 hover:underline">
              Sign In
            </a>
          </p>

          {/* Driver Benefits */}
          {formData.role === 'driver' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
              <div className="flex items-start space-x-2 mb-2">
                <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700 font-medium">
                  After registration, you'll complete your driver profile
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700 font-medium">
                  Verification takes 24-48 hours
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 hover:text-emerald-500 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;