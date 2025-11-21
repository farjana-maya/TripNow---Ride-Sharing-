import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Eye, Ban, MessageSquare, Gift, Star, Calendar, MapPin, DollarSign, TrendingUp, RefreshCw, UserX, Car, Clock, CheckCircle } from 'lucide-react';

const RiderManagement = () => {
  const [activeTab, setActiveTab] = useState('all-riders');
  const [riders, setRiders] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loyaltyStats, setLoyaltyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideModal, setShowRideModal] = useState(false);

  const tabs = [
    { id: 'all-riders', label: 'All Riders', icon: Users, count: riders.length },
    { id: 'blocked', label: 'Blocked', icon: Ban, count: riders.filter(r => r.status === 'blocked').length },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, count: feedback.length },
    { id: 'loyalty', label: 'Loyalty', icon: Gift, count: loyaltyStats?.top_riders?.length || 0 }
  ];

  useEffect(() => {
    loadRiders();
    loadFeedback();
    loadLoyaltyStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'all-riders' || activeTab === 'blocked') {
      loadRiders();
    } else if (activeTab === 'feedback') {
      loadFeedback();
    } else if (activeTab === 'loyalty') {
      loadLoyaltyStats();
    }
  }, [activeTab]);

  const loadRiders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (activeTab === 'blocked') params.append('status', 'blocked');
      
      const response = await fetch(`http://localhost:8000/api/admin/riders?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRiders(data.riders || []);
      }
    } catch (error) {
      console.error('Error loading riders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/feedback', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      // Set some sample feedback for testing
      setFeedback([
        {
          id: 1,
          rider: { name: 'John Doe' },
          rating: 4,
          message: 'Great service, but the driver was a bit late.',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          rider: { name: 'Jane Smith' },
          rating: 5,
          message: 'Excellent ride experience! Very professional driver.',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const loadLoyaltyStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/loyalty/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLoyaltyStats(data);
      }
    } catch (error) {
      console.error('Error loading loyalty stats:', error);
    }
  };

  const blockRider = async (riderId, reason = 'Admin action') => {
    if (!confirm('Are you sure you want to block this rider?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/riders/${riderId}/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await response.json();
      if (data.success) {
        alert('Rider blocked successfully');
        loadRiders();
      } else {
        alert('Failed to block rider: ' + data.message);
      }
    } catch (error) {
      console.error('Error blocking rider:', error);
      alert('Error blocking rider');
    }
  };

  const unblockRider = async (riderId) => {
    if (!confirm('Are you sure you want to unblock this rider?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/riders/${riderId}/unblock`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Rider unblocked successfully');
        loadRiders();
      } else {
        alert('Failed to unblock rider: ' + data.message);
      }
    } catch (error) {
      console.error('Error unblocking rider:', error);
      alert('Error unblocking rider');
    }
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.phone?.includes(searchTerm);
    
    if (activeTab === 'blocked') return matchesSearch && rider.status === 'blocked';
    if (activeTab === 'all-riders') return matchesSearch;
    return matchesSearch;
  });

  const RiderCard = ({ rider }) => (
    <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-cyan-500/50 transition-all relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{rider.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-white">{rider.name}</h3>
            <p className="text-sm text-gray-400">{rider.email}</p>
            <p className="text-sm text-gray-400">{rider.phone}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            rider.status === 'active' ? 'bg-green-500/20 text-green-400' :
            rider.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {rider.status?.toUpperCase() || 'ACTIVE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <p className="text-xl font-bold text-cyan-400">{rider.total_rides || 0}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-orange-400">{rider.ongoing_rides || 0}</p>
          <p className="text-xs text-gray-500">Ongoing</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-400">{rider.completed_rides || 0}</p>
          <p className="text-xs text-gray-500">Done</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-red-400">{rider.cancelled_rides || 0}</p>
          <p className="text-xs text-gray-500">Cancel</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 pt-3 border-t border-gray-800">
        <div className="text-center">
          <p className="text-lg font-bold text-green-400">৳{rider.total_spent || 0}</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-400">{rider.rating || 5.0}</p>
          <p className="text-xs text-gray-500">Rating</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <span className="text-sm text-gray-500">
          Joined {new Date(rider.created_at).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedRider(rider); setShowModal(true); }}
            className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
          >
            <Eye size={16} />
          </button>
          {rider.status === 'blocked' ? (
            <button
              onClick={() => unblockRider(rider.id)}
              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
            >
              <UserX size={16} />
            </button>
          ) : (
            <button
              onClick={() => blockRider(rider.id, 'Admin action')}
              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Ban size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const FeedbackTab = () => (
    <div className="space-y-4">
      {feedback.length === 0 ? (
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Feedback Yet</h3>
          <p className="text-gray-400">Rider feedback and complaints will appear here</p>
        </div>
      ) : (
        feedback.map(item => (
          <div key={item.id} className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{item.rider?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{item.rider?.name}</h4>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} className={`${star <= (item.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-300 mb-4">{item.message}</p>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm hover:from-cyan-600 hover:to-blue-600">
                Respond
              </button>
              <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800">
                Mark Resolved
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const LoyaltyTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Loyal Riders</h3>
        <div className="space-y-4">
          {loyaltyStats?.top_riders?.length > 0 ? (
            loyaltyStats.top_riders.slice(0, 5).map((rider, i) => (
              <div key={rider.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{rider.name}</p>
                    <p className="text-sm text-gray-400">{rider.total_rides || 0} rides</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-400">৳{rider.total_spent || 0}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No rider data available</p>
          )}
        </div>
      </div>

      <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Drivers</h3>
        <div className="space-y-4">
          {loyaltyStats?.top_drivers?.length > 0 ? (
            loyaltyStats.top_drivers.slice(0, 5).map((driver, i) => (
              <div key={driver.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{driver.name}</p>
                    <p className="text-sm text-gray-400">{driver.total_rides || 0} rides</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-cyan-400">৳{driver.total_earnings || 0}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No driver data available</p>
          )}
        </div>
      </div>

      <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800 p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-white mb-4">Referral Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Referrals</span>
            <span className="text-2xl font-bold text-cyan-400">{loyaltyStats?.referral_stats?.total_referrals || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">This Month</span>
            <span className="text-2xl font-bold text-green-400">{loyaltyStats?.referral_stats?.this_month_referrals || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Conversion Rate</span>
            <span className="text-2xl font-bold text-purple-400">{loyaltyStats?.referral_stats?.conversion_rate || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Rider Management</h1>
            <p className="text-gray-400">Manage riders, feedback, and loyalty programs</p>
          </div>
          <button
            onClick={() => {
              loadRiders();
              loadFeedback();
              loadLoyaltyStats();
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl flex items-center space-x-2 transition-all"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl backdrop-blur-xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        {(activeTab === 'all-riders' || activeTab === 'blocked') && (
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search riders by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(() => loadRiders(), 500);
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
              />
            </div>
            <button className="px-4 py-3 border border-gray-700 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 flex items-center space-x-2 text-gray-300">
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading data...</p>
          </div>
        ) : (
          <>
            {(activeTab === 'all-riders' || activeTab === 'blocked') && (
              <>
                <div className="mb-4">
                  <button 
                    onClick={() => {
                      setSelectedRide({id: 123, status: 'completed', total_fare: 250, pickup_location: 'Test Pickup', drop_location: 'Test Drop', created_at: new Date().toISOString()});
                      setShowRideModal(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Test Ride Modal
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRiders.map(rider => (
                    <RiderCard key={rider.id} rider={rider} />
                  ))}
                </div>
              </>
            )}

            {activeTab === 'feedback' && <FeedbackTab />}
            {activeTab === 'loyalty' && <LoyaltyTab />}
          </>
        )}

        {/* Rider Profile Modal */}
        {showModal && selectedRider && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Rider Profile</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Info */}
                  <div className="lg:col-span-1">
                    <div className="text-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">{selectedRider.name?.charAt(0)}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedRider.name}</h3>
                      <p className="text-gray-600">{selectedRider.email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-semibold text-gray-900">{selectedRider.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedRider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedRider.status?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Joined</span>
                        <span className="font-semibold text-gray-900">{new Date(selectedRider.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats and History */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">{selectedRider.total_rides || 0}</p>
                        <p className="text-sm text-blue-700">Total Rides</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">৳{selectedRider.total_spent || 0}</p>
                        <p className="text-sm text-green-700">Total Spent</p>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-4">Recent Rides</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedRider.rides?.length > 0 ? (
                        selectedRider.rides.map(ride => (
                          <div 
                            key={ride.id} 
                            onClick={(e) => { 
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Ride clicked:', ride);
                              setSelectedRide(ride); 
                              setShowRideModal(true); 
                            }}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500/50 transition-all hover:shadow-md active:scale-95"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  ride.status === 'completed' ? 'bg-green-500' :
                                  ride.status === 'cancelled' ? 'bg-red-500' :
                                  'bg-orange-500 animate-pulse'
                                }`}></div>
                                <div>
                                  <p className="font-semibold text-gray-900">Ride #{ride.id}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {ride.status.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">৳{ride.total_fare || 0}</p>
                                <p className="text-xs text-gray-500">{new Date(ride.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">{ride.pickup_location || 'Pickup location'}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">{ride.drop_location || 'Drop location'}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-center mt-3 pt-2 border-t border-gray-200">
                              <p className="text-xs text-blue-600 font-medium">Click to view details</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">No rides found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ride Details Modal */}
        {showRideModal && selectedRide && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Ride Details #{selectedRide.id}</h2>
                  <button
                    onClick={() => setShowRideModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedRide.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      selectedRide.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {selectedRide.status?.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">Status</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">৳{selectedRide.total_fare || 0}</p>
                    <p className="text-xs text-gray-400">Total Fare</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-cyan-400">{selectedRide.distance || 0} km</p>
                    <p className="text-xs text-gray-400">Distance</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Route Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-green-400 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm text-gray-400">Pickup Location</p>
                        <p className="text-white font-semibold">{selectedRide.pickup_location || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-4 h-4 bg-red-400 rounded-full mt-1"></div>
                      <div>
                        <p className="text-sm text-gray-400">Drop-off Location</p>
                        <p className="text-white font-semibold">{selectedRide.drop_location || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Ride Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-cyan-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">Booked At</p>
                        <p className="text-white">{new Date(selectedRide.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {selectedRide.scheduled_at && (
                      <div className="flex items-center space-x-3">
                        <Clock className="text-yellow-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-400">Scheduled For</p>
                          <p className="text-white">{new Date(selectedRide.scheduled_at).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                    {selectedRide.completed_at && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-400">Completed At</p>
                          <p className="text-white">{new Date(selectedRide.completed_at).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderManagement;