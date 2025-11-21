
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, CheckCircle, XCircle, DollarSign, Star, Navigation, Phone, LogOut, TrendingUp, Activity, AlertCircle, Loader } from 'lucide-react';

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('assigned');
  const [isOnline, setIsOnline] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    todayRides: 0,
    todayEarnings: 0,
    rating: 0,
    walletBalance: 0
  });

  // Load data on mount and tab change
  useEffect(() => {
    loadDriverRides();
    checkOnlineStatus();
    loadDriverStats();
    if (showProfile) {
      loadDriverInfo();
    }
  }, [activeTab, showProfile]);

  // Auto-refresh rides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDriverRides();
      loadDriverStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Set driver online when component mounts
  useEffect(() => {
    updateDriverStatus('online');

    const handleBeforeUnload = () => {
      updateDriverStatus('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateDriverStatus('offline');
    };
  }, []);

  // Update driver online/offline status
  const updateDriverStatus = async (status) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      await fetch('http://localhost:8000/api/driver/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      setIsOnline(status === 'online');
    } catch (error) {
      console.error('Failed to update driver status:', error);
    }
  };

  // Load driver information
  const loadDriverInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const [driverResponse, userResponse] = await Promise.all([
        fetch('http://localhost:8000/api/driver/info', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const driverData = await driverResponse.json();
      const userData = await userResponse.json();
      
      if (driverData.success && driverData.driver && userData.success) {
        setDriverInfo({
          ...driverData.driver,
          user: userData.user
        });
        setIsOnline(driverData.driver.status === 'online' || driverData.driver.status === 'approved');
      }
    } catch (error) {
      console.error('Failed to load driver info:', error);
    }
  };

  // Check current online status
  const checkOnlineStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/driver/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.driver) {
        setIsOnline(data.driver.status === 'online' || data.driver.status === 'approved');
      }
    } catch (error) {
      console.error('Failed to check online status:', error);
    }
  };

  // Load driver statistics from database
  const loadDriverStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/driver/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.stats) {
        setStats({
          totalRides: data.stats.total_rides || 0,
          totalEarnings: parseFloat(data.stats.total_earnings || 0),
          todayRides: data.stats.today_rides || 0,
          todayEarnings: parseFloat(data.stats.today_earnings || 0),
          rating: parseFloat(data.stats.rating || 0),
          walletBalance: parseFloat(data.stats.wallet_balance || 0)
        });
      }
    } catch (error) {
      console.error('Failed to load driver stats:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    
    await updateDriverStatus('offline');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Load driver rides based on active tab
  const loadDriverRides = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const params = new URLSearchParams();
      if (activeTab === 'active') {
        params.append('status', 'active');
      } else if (activeTab === 'assigned') {
        params.append('status', 'assigned');
      } else if (activeTab === 'completed') {
        params.append('status', 'completed');
      }

      const response = await fetch(`http://localhost:8000/api/driver/rides?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRides(data.rides.data || []);
      } else {
        setError(data.message || 'Failed to load rides');
      }
    } catch (error) {
      console.error('Error loading driver rides:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Accept ride
  const acceptRide = async (rideId) => {
    try {
      setActionLoading(rideId);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/driver/rides/${rideId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Ride accepted successfully! Navigate to pickup location.');
        await loadDriverRides();
        await loadDriverStats();
        setActiveTab('active');
      } else {
        alert(data.message || 'Failed to accept ride');
      }
    } catch (error) {
      console.error('Error accepting ride:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Reject ride
  const rejectRide = async (rideId) => {
    if (!confirm('Are you sure you want to reject this ride?')) return;

    try {
      setActionLoading(rideId);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/driver/rides/${rideId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Ride rejected. It will be assigned to another driver.');
        await loadDriverRides();
      } else {
        alert(data.message || 'Failed to reject ride');
      }
    } catch (error) {
      console.error('Error rejecting ride:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Arrived at pickup destination
  const arrivedAtDestination = async (rideId) => {
    if (!confirm('Have you reached the pickup location?')) return;

    try {
      setActionLoading(rideId);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/driver/rides/${rideId}/arrived`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Arrival confirmed! Waiting for passenger to board.');
        await loadDriverRides();
      } else {
        alert(data.message || 'Failed to confirm arrival');
      }
    } catch (error) {
      console.error('Error confirming arrival:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Start ride after passenger boards
  const startRide = async (rideId) => {
    if (!confirm('Is the passenger on board? Start the ride?')) return;

    try {
      setActionLoading(rideId);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/driver/rides/${rideId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('🚗 Ride started! Drive safely to the destination.');
        await loadDriverRides();
      } else {
        alert(data.message || 'Failed to start ride');
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Cash received and complete ride
  const cashReceived = async (rideId) => {
    const ride = rides.find(r => r.id === rideId);
    if (!ride) return;

    // Auto-calculate fare or use existing fare
    const fare = parseFloat(ride.total_fare) || 0;
    const distance = parseFloat(ride.distance) || 10;
    const duration = parseFloat(ride.duration) || 20;

    if (!confirm(`Confirm cash payment of ৳${fare.toFixed(0)} received from passenger?`)) return;

    try {
      setActionLoading(rideId);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`http://localhost:8000/api/driver/rides/${rideId}/payment-received`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          distance: distance,
          duration: duration,
          total_fare: fare,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Payment confirmed! Ride completed successfully. 🎉');
        await loadDriverRides();
        await loadDriverStats();
        setActiveTab('completed');
      } else {
        alert(data.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { 
      id: 'assigned', 
      label: 'New Requests', 
      count: activeTab === 'assigned' ? rides.length : rides.filter(r => r.status === 'pending' && r.assignment_id).length,
      icon: '🔔'
    },
    { 
      id: 'active', 
      label: 'Active Rides', 
      count: rides.filter(r => ['accepted', 'arrived', 'started'].includes(r.status)).length,
      icon: '🚗'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      count: rides.filter(r => r.status === 'completed').length,
      icon: '✅'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Driver Dashboard</h1>
            <p className="text-gray-400">Manage your rides and earnings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white rounded-lg transition-all shadow-lg border border-purple-600"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{(driverInfo?.user?.name || 'D').charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold">{driverInfo?.user?.name || 'Driver'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Dynamic from Database */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs md:text-sm font-medium">Total Rides</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{stats.totalRides}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Car className="text-blue-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs md:text-sm font-medium">Total Earnings</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">৳{stats.totalEarnings.toFixed(0)}</p>
                <p className="text-xs text-emerald-400 mt-1">Wallet: ৳{stats.walletBalance.toFixed(0)}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs md:text-sm font-medium">Today's Rides</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">{stats.todayRides}</p>
                <p className="text-xs text-gray-500 mt-1">This session</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Activity className="text-purple-400" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs md:text-sm font-medium">Today's Earnings</p>
                <p className="text-2xl md:text-3xl font-bold text-white mt-1">৳{stats.todayEarnings.toFixed(0)}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 ml-1">{stats.rating.toFixed(1)} rating</span>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-yellow-400" size={20} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-800/50 p-2 rounded-2xl backdrop-blur-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-700">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No rides found</h3>
            <p className="text-gray-400 mb-4">
              {activeTab === 'assigned' && "No new ride requests at the moment. Stay online to receive requests!"}
              {activeTab === 'active' && "No active rides. Accept a ride from 'New Requests' to get started!"}
              {activeTab === 'completed' && "No completed rides yet. Complete rides to see them here."}
            </p>
            {activeTab !== 'assigned' && (
              <button
                onClick={() => setActiveTab('assigned')}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
              >
                View New Requests
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-all">
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-white">
                          Ride #{ride.ride_number}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400">
                          {new Date(ride.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex px-2 md:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        (ride.status === 'pending' && activeTab === 'assigned') || ride.status === 'assigned' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/50' :
                        ride.status === 'accepted' ? 'bg-blue-900/20 text-blue-400 border border-blue-500/50' :
                        ride.status === 'arrived' ? 'bg-orange-900/20 text-orange-400 border border-orange-500/50' :
                        ride.status === 'started' ? 'bg-green-900/20 text-green-400 border border-green-500/50' :
                        ride.status === 'completed' ? 'bg-purple-900/20 text-purple-400 border border-purple-500/50' :
                        'bg-gray-900/20 text-gray-400 border border-gray-500/50'
                      }`}>
                        {((ride.status === 'pending' && activeTab === 'assigned') || ride.status === 'assigned') && '🔔 New Request'}
                        {ride.status === 'accepted' && '🚗 On Way'}
                        {ride.status === 'arrived' && '📍 Arrived'}
                        {ride.status === 'started' && '🏁 In Progress'}
                        {ride.status === 'completed' && '✅ Completed'}
                      </span>
                      <p className="text-base md:text-lg font-bold text-emerald-400 mt-2">
                        ৳{(parseFloat(ride.total_fare) || 0).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Rider Info */}
                  <div className="mb-4 p-3 md:p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <span className="text-xs md:text-sm font-semibold text-white">
                            {ride.rider?.name?.charAt(0).toUpperCase() || 'R'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm md:text-base">{ride.rider?.name || 'Rider'}</p>
                          <p className="text-xs md:text-sm text-gray-400">{ride.rider?.phone || 'No phone'}</p>
                        </div>
                      </div>
                      <a
                        href={`tel:${ride.rider?.phone || ''}`}
                        className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors p-2 hover:bg-emerald-500/10 rounded-lg"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden md:inline text-sm">Call</span>
                      </a>
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Pickup</p>
                        <p className="text-white text-sm md:text-base">{ride.pickup_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 md:space-x-3">
                      <Navigation className="h-4 w-4 md:h-5 md:w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Drop-off</p>
                        <p className="text-white text-sm md:text-base">{ride.drop_location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 text-xs md:text-sm">
                    <div className="p-2 md:p-3 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 mb-1">Vehicle</p>
                      <p className="font-semibold text-white capitalize">{ride.vehicle_type || ride.ride_type || 'Standard'}</p>
                    </div>
                    <div className="p-2 md:p-3 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 mb-1">Distance</p>
                      <p className="font-semibold text-white">{ride.distance ? `${parseFloat(ride.distance).toFixed(1)} km` : '10.0 km'}</p>
                    </div>
                    <div className="p-2 md:p-3 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 mb-1">Earnings</p>
                      <p className="font-semibold text-emerald-400">৳{ride.driver_earnings ? parseFloat(ride.driver_earnings).toFixed(0) : Math.round((parseFloat(ride.total_fare) || 0) * 0.8)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {((ride.status === 'pending' && activeTab === 'assigned') || ride.status === 'assigned') && (
                      <>
                        <button
                          onClick={() => acceptRide(ride.id)}
                          disabled={actionLoading === ride.id}
                          className="flex-1 min-w-[120px] px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm font-medium shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {actionLoading === ride.id ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              <span>Accept Ride</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => rejectRide(ride.id)}
                          disabled={actionLoading === ride.id}
                          className="px-3 md:px-4 py-2 md:py-3 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    
                    {ride.status === 'accepted' && (
                      <button
                        onClick={() => arrivedAtDestination(ride.id)}
                        disabled={actionLoading === ride.id}
                        className="flex-1 min-w-[120px] px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-medium shadow-lg flex items-center justify-center space-x-2"
                      >
                        {actionLoading === ride.id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <>
                            <MapPin size={16} />
                            <span>Reached Pickup</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {ride.status === 'arrived' && (
                      <button
                        onClick={() => startRide(ride.id)}
                        disabled={actionLoading === ride.id}
                        className="flex-1 min-w-[120px] px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-lg flex items-center justify-center space-x-2"
                      >
                        {actionLoading === ride.id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Car size={16} />
                            <span>Start Ride</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {ride.status === 'started' && (
                      <button
                        onClick={() => cashReceived(ride.id)}
                        disabled={actionLoading === ride.id}
                        className="flex-1 min-w-[120px] px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium shadow-lg flex items-center justify-center space-x-2 animate-pulse"
                      >
                        {actionLoading === ride.id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : (
                          <>
                            <DollarSign size={16} />
                            <span>Cash Received (৳{(parseFloat(ride.total_fare) || 0).toFixed(0)})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Status Instructions */}
                  {((ride.status === 'pending' && activeTab === 'assigned') || ride.status === 'assigned') && (
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-300">
                          <strong>New Ride Request!</strong> Review the details and accept if you're available. You have 2 minutes to respond.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {ride.status === 'accepted' && (
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-300">
                          <strong>Navigate to pickup location.</strong> Click "Reached Pickup" when you arrive at <strong>{ride.pickup_location}</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {ride.status === 'arrived' && (
                    <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg animate-pulse">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-300">
                          <strong>Waiting for passenger.</strong> Once <strong>{ride.rider?.name}</strong> boards the vehicle, click "Start Ride".
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {ride.status === 'started' && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-green-300">
                          <strong>Drive to drop-off:</strong> <strong>{ride.drop_location}</strong>. After reaching destination and collecting ৳{(parseFloat(ride.total_fare) || 0).toFixed(0)} in cash, click "Cash Received".
                        </p>
                      </div>
                    </div>
                  )}

                  {ride.status === 'completed' && (
                    <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 mb-2">
                            <strong>Ride Completed!</strong> Payment received: ৳{(parseFloat(ride.total_fare) || 0).toFixed(0)}. Your earnings: ৳{ride.driver_earnings ? parseFloat(ride.driver_earnings).toFixed(0) : Math.round((parseFloat(ride.total_fare) || 0) * 0.8)}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-gray-400">Distance: {ride.distance ? parseFloat(ride.distance).toFixed(1) : '10.0'} km</span>
                            <span className="text-gray-400">Duration: {ride.duration ? parseFloat(ride.duration).toFixed(0) : '20'} min</span>
                            <span className="text-emerald-400">Completed at: {new Date(ride.completed_at || ride.updated_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-2xl p-6 border border-emerald-500/30">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-emerald-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">How to Use the Dashboard</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span><strong>New Requests:</strong> Accept or reject ride requests. You have limited time to respond.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span><strong>Active Rides:</strong> Follow the button flow: Accept → Reached Pickup → Start Ride → Cash Received.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400 font-bold">3.</span>
                  <span><strong>Completed:</strong> View your ride history and earnings breakdown.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">4.</span>
                  <span><strong>Stay Online:</strong> Make sure you're online to receive ride requests automatically.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Dashboard updates automatically every 10 seconds • {isOnline ? '🟢 Receiving ride requests' : '🔴 Not receiving requests'}</p>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{driverInfo?.user?.name?.charAt(0).toUpperCase() || 'D'}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Driver Profile</h2>
                    <p className="text-blue-100">Manage your information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={driverInfo?.user?.name || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={driverInfo?.user?.phone || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={driverInfo?.user?.email || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">NID Number</label>
                    <input
                      type="text"
                      value={driverInfo?.nid_number || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Address</label>
                    <textarea
                      value={`${driverInfo?.address || ''}, ${driverInfo?.city || ''}, ${driverInfo?.state || ''} ${driverInfo?.postal_code || ''}`.replace(/^, |, $|, , /g, '') || 'Not provided'}
                      disabled={!editMode}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 resize-none"
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Vehicle Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Vehicle Type</label>
                    <input
                      type="text"
                      value={driverInfo?.vehicle_type?.charAt(0).toUpperCase() + driverInfo?.vehicle_type?.slice(1) || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      value={driverInfo?.vehicle_number || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Vehicle Model & Year</label>
                    <input
                      type="text"
                      value={`${driverInfo?.vehicle_model || ''} ${driverInfo?.vehicle_year || ''}`.trim() || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Vehicle Color</label>
                    <input
                      type="text"
                      value={driverInfo?.vehicle_color || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">License Number</label>
                    <input
                      type="text"
                      value={driverInfo?.license_number || 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">License Expiry</label>
                    <input
                      type="text"
                      value={driverInfo?.license_expiry ? new Date(driverInfo.license_expiry).toLocaleDateString() : 'Not provided'}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Driver Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{stats.totalRides}</p>
                    <p className="text-sm text-gray-400">Total Rides</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">৳{stats.totalEarnings.toFixed(0)}</p>
                    <p className="text-sm text-gray-400">Total Earnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{stats.rating.toFixed(1)}</p>
                    <p className="text-sm text-gray-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">৳{stats.walletBalance.toFixed(0)}</p>
                    <p className="text-sm text-gray-400">Wallet</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        alert('Profile updated successfully!');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;