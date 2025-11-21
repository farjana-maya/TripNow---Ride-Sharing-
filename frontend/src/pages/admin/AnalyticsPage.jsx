import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Car, 
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target
} from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      // Fetch all data in parallel - EXACT same as PaymentFinance
      const [statsRes, transactionsRes, paymentMethodsRes, revenueChartRes, vehicleTypesRes, peakHoursRes] = await Promise.all([
        fetch(`http://localhost:8000/api/admin/finance/stats?date_range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8000/api/admin/finance/transactions?date_range=${dateRange}&status=all&search=`, {
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
        }),
        fetch(`http://localhost:8000/api/admin/analytics/driver-vehicle-types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8000/api/admin/analytics/peak-hours`, {
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
        
        // Analyze transactions for ride status only
        const statusCounts = { completed: 0, cancelled: 0, pending: 0 };
        
        transactionsData.forEach(ride => {
          // Count by status
          if (ride.status === 'completed') statusCounts.completed++;
          else if (ride.status === 'cancelled') statusCounts.cancelled++;
          else statusCounts.pending++;
        });
        
        setStats(prev => ({
          ...prev,
          rideStatusCounts: statusCounts
        }));
      }
      
      if (vehicleTypesRes.ok) {
        const vehicleTypesData = await vehicleTypesRes.json();
        setStats(prev => ({
          ...prev,
          vehicleTypeCounts: vehicleTypesData
        }));
      }
      
      if (paymentMethodsRes.ok) {
        const paymentMethodsData = await paymentMethodsRes.json();
        setPaymentMethods(paymentMethodsData);
      }
      
      if (revenueChartRes.ok) {
        const revenueChartData = await revenueChartRes.json();
        setRevenueChart(revenueChartData);
      }
      
      if (peakHoursRes.ok) {
        const peakHoursData = await peakHoursRes.json();
        setPeakHours(peakHoursData);
      }
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, color = 'cyan' }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `var(--${color}-500-20, rgba(6, 182, 212, 0.2))` }}>
          <Icon className="text-cyan-400" size={24} />
        </div>
        <div className={`flex items-center space-x-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">{Math.abs(change || 0)}%</span>
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value || 0}</p>
    </div>
  );

  const LineChart = ({ data, title }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="text-gray-500 mx-auto mb-2" size={48} />
              <p className="text-gray-400">No data available</p>
            </div>
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.value || 0), 1);
    const width = 400;
    const height = 200;
    const padding = 40;
    
    const points = data.map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((item.value || 0) / maxValue) * (height - 2 * padding);
      return { x, y, value: item.value || 0, label: item.label };
    });
    
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
        <div className="h-64">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={padding}
                y1={height - padding - ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - ratio * (height - 2 * padding)}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Area under curve */}
            <path
              d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#gradient)"
              opacity="0.3"
            />
            
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#06b6d4"
                  stroke="#1f2937"
                  strokeWidth="2"
                  className="hover:r-6 transition-all cursor-pointer"
                />
                <text
                  x={point.x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {point.label}
                </text>
              </g>
            ))}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  const PeakHoursChart = () => {
    const maxValue = Math.max(...peakHours.map(h => h.total), 1);
    const width = 800;
    const height = 300;
    const padding = 60;
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Peak Hours Analysis - Ride Bookings by Vehicle Type</h3>
        <div className="h-80">
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`peak-grid-${i}`}
                x1={padding}
                y1={height - padding - ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - ratio * (height - 2 * padding)}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Hour labels */}
            {peakHours.map((hour, index) => {
              const x = padding + (index * (width - 2 * padding)) / (peakHours.length - 1);
              return (
                <text
                  key={`hour-${hour.hour}`}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="10"
                >
                  {hour.hour}:00
                </text>
              );
            })}
            
            {/* Stacked bars for each vehicle type */}
            {peakHours.map((hour, index) => {
              const x = padding + (index * (width - 2 * padding)) / (peakHours.length - 1) - 8;
              const barWidth = 16;
              let yOffset = 0;
              
              const vehicleTypes = [
                { key: 'standard', color: '#06b6d4' },
                { key: 'premium', color: '#8b5cf6' },
                { key: 'suv', color: '#f59e0b' },
                { key: 'bike', color: '#10b981' }
              ];
              
              return vehicleTypes.map((vehicle, vIndex) => {
                const value = hour[vehicle.key] || 0;
                const barHeight = (value / maxValue) * (height - 2 * padding);
                const y = height - padding - yOffset - barHeight;
                yOffset += barHeight;
                
                return (
                  <rect
                    key={`bar-${hour.hour}-${vehicle.key}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={vehicle.color}
                    className="hover:opacity-80 cursor-pointer"
                  />
                );
              });
            })}
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <text
                key={`peak-y-${i}`}
                x={padding - 10}
                y={height - padding - ratio * (height - 2 * padding) + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="10"
              >
                {Math.round(maxValue * ratio)}
              </text>
            ))}
          </svg>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-gray-300 text-sm">Standard</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-300 text-sm">Premium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-300 text-sm">SUV</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-300 text-sm">Bike</span>
          </div>
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48 group">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8"/>
              {total > 0 ? data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage * 2.51} 251`;
                const strokeDashoffset = -currentAngle * 2.51;
                currentAngle += percentage;
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 hover:stroke-opacity-80 cursor-pointer"
                  />
                );
              }) : (
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="8"/>
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{total}</p>
                <p className="text-gray-400 text-sm">Total</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                <span className="text-gray-300 text-sm">{item.label}</span>
              </div>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Business Analytics</h1>
            <p className="text-gray-400">Comprehensive overview of your ride-sharing business</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`৳${(stats.totalRevenue || 0).toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            color="green"
          />
          <MetricCard
            title="Total Transactions"
            value={(stats.totalTransactions || 0).toLocaleString()}
            change={8.3}
            icon={Car}
            color="blue"
          />
          <MetricCard
            title="Total Riders"
            value={(stats.totalRiders || 0).toLocaleString()}
            change={15.2}
            icon={Users}
            color="purple"
          />
          <MetricCard
            title="Avg Ride Value"
            value={`৳${stats.averageRideValue || 0}`}
            change={5.7}
            icon={Target}
            color="cyan"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart
            data={revenueChart.map(item => ({
              label: item.date,
              value: item.revenue || 0
            }))}
            title="Revenue Trend"
          />
          <LineChart
            data={revenueChart.map(item => ({
              label: item.date,
              value: item.rides || 0
            }))}
            title="Rides Completed"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DonutChart
            data={[
              { label: 'Completed', value: stats.rideStatusCounts?.completed || 0, color: '#10b981' },
              { label: 'Cancelled', value: stats.rideStatusCounts?.cancelled || 0, color: '#ef4444' },
              { label: 'Pending', value: stats.rideStatusCounts?.pending || 0, color: '#f59e0b' }
            ]}
            title="Ride Status Distribution"
          />
          <DonutChart
            data={[
              { label: 'Standard', value: stats.vehicleTypeCounts?.standard || 0, color: '#06b6d4' },
              { label: 'Premium', value: stats.vehicleTypeCounts?.premium || 0, color: '#8b5cf6' },
              { label: 'SUV', value: stats.vehicleTypeCounts?.suv || 0, color: '#f59e0b' },
              { label: 'Bike', value: stats.vehicleTypeCounts?.bike || 0, color: '#10b981' }
            ]}
            title="Vehicle Type Distribution"
          />
          <DonutChart
            data={[
              { label: 'Cash', value: paymentMethods.cash_count || 0, color: '#10b981' },
              { label: 'Card', value: paymentMethods.card_count || 0, color: '#06b6d4' },
              { label: 'Digital', value: paymentMethods.wallet_count || 0, color: '#8b5cf6' }
            ]}
            title="Payment Methods"
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Total Drivers</span>
                <span className="text-white font-bold">{stats.totalDrivers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Active Drivers</span>
                <span className="text-green-400 font-bold">{stats.activeDrivers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Total Riders</span>
                <span className="text-yellow-400 font-bold">{stats.totalRiders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Active Rides</span>
                <span className="text-cyan-400 font-bold">{stats.activeRides || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Financial Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Total Revenue</span>
                <span className="text-white font-bold">৳{(stats.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Driver Earnings</span>
                <span className="text-blue-400 font-bold">৳{(stats.driverEarnings || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Commission Earned</span>
                <span className="text-green-400 font-bold">৳{(stats.commissionEarned || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <span className="text-gray-300">Profit Margin</span>
                <span className="text-cyan-400 font-bold">{stats.profitMargin || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours Analysis */}
        <PeakHoursChart />
      </div>
    </div>
  );
};

export default AnalyticsPage;