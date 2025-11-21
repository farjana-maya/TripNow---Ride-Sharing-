import React, { useState, useEffect } from 'react';
import AnalyticsPage from './AnalyticsPage';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  Download,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const PaymentFinance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange, filterType]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      // Fetch all data in parallel
      const [statsRes, transactionsRes, paymentMethodsRes, revenueChartRes] = await Promise.all([
        fetch(`http://localhost:8000/api/admin/finance/stats?date_range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8000/api/admin/finance/transactions?date_range=${dateRange}&status=${filterType}&search=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8000/api/admin/finance/payment-methods`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8000/api/admin/finance/revenue-chart?period=week`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      }
      
      if (paymentMethodsRes.ok) {
        const paymentMethodsData = await paymentMethodsRes.json();
        setPaymentMethods(paymentMethodsData);
      }
      
      if (revenueChartRes.ok) {
        const revenueChartData = await revenueChartRes.json();
        setRevenueChart(revenueChartData);
      }
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-cyan-500/20 rounded-lg">
          <Icon className="text-cyan-400" size={24} />
        </div>
        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="text-sm font-medium">{change}%</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">৳{value?.toLocaleString()}</p>
    </div>
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payment & Finance</h1>
          <p className="text-gray-400">Manage transactions, payouts, and financial analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                change={12.5}
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="Today's Revenue"
                value={stats.todayRevenue}
                change={8.3}
                icon={TrendingUp}
                trend="up"
              />
              <StatCard
                title="Commission Earned"
                value={stats.commissionEarned}
                change={15.2}
                icon={Wallet}
                trend="up"
              />
              <StatCard
                title="Total Transactions"
                value={stats.totalTransactions}
                change={22.8}
                icon={BarChart3}
                trend="up"
              />
              <StatCard
                title="Total Riders"
                value={stats.totalRiders}
                change={8.4}
                icon={CreditCard}
                trend="up"
              />
              <StatCard
                title="Total Drivers"
                value={stats.totalDrivers}
                change={3.2}
                icon={TrendingUp}
                trend="up"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/30 transition-colors">
                  <Download className="text-cyan-400" size={20} />
                  <span className="text-white font-medium">Export Report</span>
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center space-x-3 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/30 transition-colors"
                >
                  <TrendingUp className="text-green-400" size={20} />
                  <span className="text-white font-medium">View Analytics</span>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-colors">
                  <BarChart3 className="text-blue-400" size={20} />
                  <span className="text-white font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {transactions.map(ride => (
                <div 
                  key={ride.id} 
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedRide(ride)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-cyan-400 font-mono text-sm">#{ride.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ride.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          ride.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {ride.status}
                        </span>
                      </div>
                      <div className="text-white font-medium mb-1">
                        {ride.rider_name} → {ride.driver_name}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {ride.pickup_location} → {ride.drop_location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">৳{ride.total_fare}</div>
                      <div className="text-gray-400 text-sm">{new Date(ride.completed_at || ride.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <BarChart3 className="text-cyan-400 mx-auto mb-4" size={64} />
                <h2 className="text-3xl font-bold text-white mb-4">Complete Business Analytics</h2>
                <p className="text-gray-300 text-lg mb-8">
                  Get comprehensive insights into your ride-sharing business with detailed charts, 
                  performance metrics, and growth analytics.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <TrendingUp className="text-green-400 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-semibold mb-1">Revenue Analytics</h3>
                  <p className="text-gray-400 text-sm">Track revenue trends and growth patterns</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <PieChart className="text-blue-400 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-semibold mb-1">Performance Metrics</h3>
                  <p className="text-gray-400 text-sm">Monitor key business indicators</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <Activity className="text-purple-400 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-semibold mb-1">Real-time Data</h3>
                  <p className="text-gray-400 text-sm">Live updates from your database</p>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveTab('full-analytics')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Open Full Analytics Dashboard
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                Complete graphical overview with charts and metrics
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Full Analytics Tab */}
      {activeTab === 'full-analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Back to Analytics Overview</span>
            </button>
          </div>
          <AnalyticsPage />
        </div>
      )}

      {/* Ride Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Ride Details</h3>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Ride ID</label>
                    <p className="text-white font-mono">#{selectedRide.id}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Rider</label>
                    <p className="text-white">{selectedRide.rider_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Driver</label>
                    <p className="text-white">{selectedRide.driver_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Vehicle Type</label>
                    <p className="text-white capitalize">{selectedRide.vehicle_type}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedRide.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      selectedRide.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedRide.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Total Fare</label>
                    <p className="text-white font-bold text-lg">৳{selectedRide.total_fare}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Commission</label>
                    <p className="text-red-400">৳{selectedRide.commission}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Driver Earnings</label>
                    <p className="text-green-400">৳{selectedRide.driver_earnings}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Pickup Location</label>
                  <p className="text-white">{selectedRide.pickup_location}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Drop Location</label>
                  <p className="text-white">{selectedRide.drop_location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Created At</label>
                    <p className="text-white">{new Date(selectedRide.created_at).toLocaleString()}</p>
                  </div>
                  {selectedRide.completed_at && (
                    <div>
                      <label className="text-gray-400 text-sm">Completed At</label>
                      <p className="text-white">{new Date(selectedRide.completed_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFinance;