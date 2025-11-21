import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Car, Shield, TrendingUp, LogOut, Menu, X,
  Navigation, Search, Bell, Settings, Home, DollarSign,
  Star, BarChart3, MapPin, Clock, Calendar, Zap, Activity,
  TrendingDown, AlertCircle, CheckCircle, XCircle, ArrowUp,
  ArrowDown, Filter, Download, RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NotificationBadge from '../components/NotificationBadge';
import AdminDriverManagement from './AdminDriverManagement';
import AdminRideManagement from './AdminRideManagement';
import RiderManagement from './admin/RiderManagement';
import PaymentFinance from './admin/PaymentFinance';
import AnalyticsPage from './admin/AnalyticsPage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentRides, setRecentRides] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [ridesChart, setRidesChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');


  useEffect(() => {
    loadDashboardData();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (data.success && data.user.role === 'admin') {
        setUser(data.user);
      } else {
        alert('Access denied. Admin privileges required.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get auth token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      // Fetch real dashboard data from API
      const response = await fetch('http://localhost:8000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const dashboardData = data.data;

        // Set statistics
        setStats(dashboardData.statistics);

        // Set recent users
        setRecentUsers(dashboardData.recent_users);

        // Set recent rides
        setRecentRides(dashboardData.recent_rides);

        // Set top drivers
        setTopDrivers(dashboardData.top_drivers);

        // Set chart data
        setRevenueChart(dashboardData.revenue_chart);
        setRidesChart(dashboardData.rides_chart);
      } else {
        console.error('Failed to load dashboard data:', data.message);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    navigate('/login');
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleClearActiveRides = async () => {
    if (!confirm('Are you sure you want to clear all active rides? This will cancel all pending, assigned, accepted, arrived, and started rides.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/rides/clear-active', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully cleared ${data.cleared_count} active rides`);
        loadDashboardData();
      } else {
        alert('Failed to clear active rides: ' + data.message);
      }
    } catch (error) {
      console.error('Error clearing active rides:', error);
      alert('Error clearing active rides');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null, color: 'from-blue-500 to-cyan-500' },
    { id: 'rides', icon: MapPin, label: 'Ride Management', badge: null, color: 'from-purple-500 to-pink-500' },
    { id: 'drivers', icon: Car, label: 'Driver Management', badge: null, color: 'from-emerald-500 to-teal-500' },
    { id: 'riders', icon: Users, label: 'Rider Management', badge: null, color: 'from-orange-500 to-red-500' },
    { id: 'payments', icon: DollarSign, label: 'Payments & Finance', badge: null, color: 'from-yellow-500 to-orange-500' },
    { id: 'ratings', icon: Star, label: 'Ratings & Reviews', badge: null, color: 'from-pink-500 to-rose-500' },
    { id: 'reports', icon: BarChart3, label: 'Reports & Insights', badge: null, color: 'from-indigo-500 to-purple-500' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null, color: 'from-gray-600 to-gray-800' },
  ];

  const GlowingStatCard = ({ icon: Icon, title, value, gradient, trend, subtitle }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 blur-lg group-hover:opacity-100 transition duration-300"
           style={{ background: `linear-gradient(to right, ${gradient})` }}></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : trend < 0 ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {trend > 0 ? <ArrowUp size={14} /> : trend < 0 ? <ArrowDown size={14} /> : <Activity size={14} />}
              <span className="text-xs font-bold">{trend > 0 ? '+' : ''}{trend}%</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-1">{value || 0}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 z-30 border-r border-gray-800 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur-md opacity-75"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Navigation className="text-white transform rotate-45" size={22} />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  TripNow
                    </h1>
                    <p className="text-xs text-cyan-400 font-bold tracking-widest">ADMIN</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  activeMenu === item.id ? 'shadow-lg' : ''
                }`}
              >
                {activeMenu === item.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-100`}></div>
                )}
                <div className={`relative flex items-center justify-between px-4 py-3 ${
                  activeMenu === item.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-white/20 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          {sidebarOpen && user && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-cyan-400">Administrator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-20">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <span>Dashboard Overview</span>
                  <Zap size={24} className="text-cyan-400" />
                </h2>
                <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="p-3 hover:bg-gray-800 rounded-xl transition-colors group"
                >
                  <RefreshCw size={20} className="text-gray-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-all duration-500" />
                </button>



                <NotificationBadge user={user} />

                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 rounded-xl text-white font-semibold flex items-center space-x-2 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {activeMenu === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <GlowingStatCard
                  icon={Users}
                  title="Total Riders"
                  value={(parseInt(stats?.total_users) || 0).toLocaleString()}
                  gradient="from-blue-500 to-cyan-500"
                  trend={12}
                  subtitle="Active users"
                />
                <GlowingStatCard
                  icon={Car}
                  title="Total Drivers"
                  value={(parseInt(stats?.total_drivers) || 0).toLocaleString()}
                  gradient="from-emerald-500 to-teal-500"
                  trend={8}
                  subtitle={`${parseInt(stats?.pending_driver_approvals) || 0} pending`}
                />
                <GlowingStatCard
                  icon={MapPin}
                  title="Active Rides"
                  value={parseInt(stats?.ongoing_rides) || 0}
                  gradient="from-orange-500 to-red-500"
                  trend={-3}
                  subtitle="Ongoing now"
                />
                <GlowingStatCard
                  icon={DollarSign}
                  title="Today's Revenue"
                  value={`$${(parseFloat(stats?.today_revenue) || 0).toFixed(2)}`}
                  gradient="from-purple-500 to-pink-500"
                  trend={15}
                  subtitle={`${parseInt(stats?.today_rides) || 0} rides`}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
                      <p className="text-sm text-gray-400">Last 7 days</p>
                    </div>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Download size={18} className="text-gray-400" />
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={revenueChart}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 12}} tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis stroke="#9ca3af" tick={{fontSize: 12}} />
                      <Tooltip
                        contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px'}}
                        labelStyle={{color: '#9ca3af'}}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Rides Chart */}
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">Rides Overview</h3>
                      <p className="text-sm text-gray-400">Daily ride statistics</p>
                    </div>
                    <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <Filter size={18} className="text-gray-400" />
                    </button>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ridesChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" tick={{fontSize: 12}} tickFormatter={(value) => new Date(value).getDate().toString()} />
                      <YAxis stroke="#9ca3af" tick={{fontSize: 12}} />
                      <Tooltip
                        contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px'}}
                        labelStyle={{color: '#9ca3af'}}
                      />
                      <Bar dataKey="rides" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Rides */}
                <div className="lg:col-span-2 bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800">
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white">Recent Rides</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentRides.map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                              <MapPin size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">#{ride.id}</p>
                              <p className="text-sm text-gray-400">{ride.rider?.name || 'Unknown Rider'} → {ride.driver?.user?.name || 'Unknown Driver'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">${(parseFloat(ride.fare) || 0).toFixed(2)}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              ride.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {ride.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Drivers */}
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800">
                  <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white">Top Drivers</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {topDrivers.map((driver, index) => (
                        <div key={driver.id} className="flex items-center space-x-3">
                          <div className="text-2xl font-bold text-gray-600">#{index + 1}</div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{driver.user?.name || 'Unknown Driver'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-400">{driver.rating}</span>
                              <span className="text-xs text-gray-600">•</span>
                              <span className="text-xs text-gray-400">{driver.total_rides} rides</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeMenu === 'drivers' && <AdminDriverManagement />}
          {activeMenu === 'rides' && <AdminRideManagement />}
          {activeMenu === 'riders' && <RiderManagement />}
          {activeMenu === 'payments' && <PaymentFinance />}
          {activeMenu === 'reports' && <AnalyticsPage />}
          {activeMenu !== 'dashboard' && activeMenu !== 'drivers' && activeMenu !== 'rides' && activeMenu !== 'riders' && activeMenu !== 'payments' && activeMenu !== 'reports' && (
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  {React.createElement(menuItems.find(item => item.id === activeMenu)?.icon || Home, {
                    size: 64,
                    className: "text-cyan-400 mx-auto"
                  })}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {menuItems.find(item => item.id === activeMenu)?.label}
                </h3>
                <p className="text-gray-400 text-lg">
                  This module is under development
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
