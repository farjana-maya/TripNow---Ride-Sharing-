import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Clock, CheckCircle, Mail, Bell, Shield, Navigation, 
  LogOut, Home, RefreshCw, AlertCircle
} from 'lucide-react';

const DriverPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndStatus();

    // Set up real-time status checking every 30 seconds
    const interval = setInterval(() => {
      checkAuthAndStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkAuthAndStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Check current driver status
      const response = await fetch('http://localhost:8000/api/driver/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success && data.has_submitted) {
        setDriver(data.driver);
        
        // If status changed, redirect accordingly
        if (data.driver.status === 'approved') {
          alert('🎉 Congratulations! Your driver account has been approved. You can now start accepting rides!');
          navigate('/driver/dashboard');
        } else if (data.driver.status === 'rejected') {
          navigate('/driver/rejected', { state: { driver: data.driver } });
        }
      } else {
        // No driver info submitted
        navigate('/driver-form');
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleRefresh = () => {
    setLoading(true);
    checkAuthAndStatus();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                  <Navigation className="text-emerald-500 transform rotate-45" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  TripNow
                </h1>
                <p className="text-xs text-gray-500 tracking-wider font-semibold">DRIVER PORTAL</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all group"
              >
                <RefreshCw size={20} className="text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 hover:text-emerald-500 font-semibold transition-all flex items-center space-x-2"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Status Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center">
            {/* Animated Clock Icon */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Clock className="text-white" size={64} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Application Under Review
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your driver application is being verified by our team
            </p>

            {/* Status Timeline */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900">Application Submitted</h3>
                    <p className="text-sm text-gray-600">Your information has been received successfully</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Shield className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900">Verification in Progress</h3>
                    <p className="text-sm text-gray-600">Our team is reviewing your documents</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 opacity-50">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900">Approval & Activation</h3>
                    <p className="text-sm text-gray-600">You'll receive email and notification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            {driver && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Submitted Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Vehicle Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{driver.vehicle_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vehicle Model</p>
                    <p className="font-semibold text-gray-900">{driver.vehicle_model}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vehicle Number</p>
                    <p className="font-semibold text-gray-900">{driver.vehicle_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(driver.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Methods */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                <Mail className="text-blue-500 mx-auto mb-3" size={32} />
                <h3 className="font-bold text-gray-900 mb-2">Email Notification</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an email at {user?.email} once approved
                </p>
              </div>
              <div className="bg-white border-2 border-emerald-200 rounded-xl p-6">
                <Bell className="text-emerald-500 mx-auto mb-3" size={32} />
                <h3 className="font-bold text-gray-900 mb-2">In-App Notification</h3>
                <p className="text-sm text-gray-600">
                  Check your notifications for updates
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">What's Next?</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Verification typically takes 24-48 hours</li>
                    <li>• Our admin team is reviewing your documents carefully</li>
                    <li>• You'll be notified via email and in-app notification once approved</li>
                    <li>• After approval, you can immediately start accepting rides</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Have questions? Need help?
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPending;