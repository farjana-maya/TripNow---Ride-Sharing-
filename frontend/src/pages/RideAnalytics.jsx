import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Car, 
  Clock, MapPin, Users, Calendar, ArrowUp, ArrowDown 
} from 'lucide-react';

const RideAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today'); // today, week, month, year

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/admin/rides/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount ? `৳${parseFloat(amount).toFixed(2)}` : '৳0.00';
  };

  const calculatePercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ride Analytics</h1>
          <p className="text-gray-400 mt-1">Comprehensive insights and statistics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Rides */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Car className="h-6 w-6" />
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>12%</span>
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Total Rides</p>
          <p className="text-3xl font-bold">{stats?.total_rides || 0}</p>
          <p className="text-white/60 text-xs mt-2">
            Today: {stats?.today_rides || 0}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>8%</span>
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.total_revenue)}</p>
          <p className="text-white/60 text-xs mt-2">
            Today: {formatCurrency(stats?.today_revenue)}
          </p>
        </div>

        {/* Completed Rides */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>15%</span>
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Completed Rides</p>
          <p className="text-3xl font-bold">{stats?.completed_rides || 0}</p>
          <p className="text-white/60 text-xs mt-2">
            Today: {stats?.today_completed || 0}
          </p>
        </div>

        {/* Ongoing Rides */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <p className="text-white/80 text-sm mb-1">Ongoing Rides</p>
          <p className="text-3xl font-bold">{stats?.ongoing_rides || 0}</p>
          <p className="text-white/60 text-xs mt-2">Real-time active</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Revenue</span>
                <span className="text-white font-semibold">{formatCurrency(stats?.total_revenue)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Commission</span>
                <span className="text-white font-semibold">{formatCurrency(stats?.total_commission)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" 
                     style={{ width: `${(stats?.total_commission / stats?.total_revenue * 100) || 0}%` }}>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Driver Earnings</span>
                <span className="text-white font-semibold">{formatCurrency(stats?.total_driver_earnings)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" 
                     style={{ width: `${(stats?.total_driver_earnings / stats?.total_revenue * 100) || 0}%` }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Ride Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-gray-300">Pending Rides</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.pending_rides || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Car className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-gray-300">Cancelled Rides</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.cancelled_rides || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-gray-300">Average Distance</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.avg_distance || 0} km</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-gray-300">Average Fare</span>
              </div>
              <span className="text-2xl font-bold text-white">{formatCurrency(stats?.avg_fare)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Vehicle Type Distribution</h3>
          <div className="space-y-3">
            {stats?.vehicle_type_distribution?.map((item, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
              const percentage = (item.count / stats.total_rides * 100).toFixed(1);
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 capitalize">{item.vehicle_type}</span>
                    <span className="text-white font-semibold">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {stats?.payment_method_distribution?.map((item, index) => {
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500'];
              const total = stats.payment_method_distribution.reduce((sum, p) => sum + p.count, 0);
              const percentage = (item.count / total * 100).toFixed(1);
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 capitalize">{item.payment_method || 'N/A'}</span>
                    <span className="text-white font-semibold">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hourly Distribution */}
      {stats?.hourly_distribution && stats.hourly_distribution.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Today's Hourly Distribution</h3>
          <div className="flex items-end justify-between h-48 space-x-2">
            {stats.hourly_distribution.map((item, index) => {
              const maxCount = Math.max(...stats.hourly_distribution.map(h => h.count));
              const height = (item.count / maxCount * 100);
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-500/20 rounded-t-lg relative group cursor-pointer hover:bg-blue-500/40 transition-colors"
                       style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.count} rides
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 mt-2">{item.hour}:00</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RideAnalytics;