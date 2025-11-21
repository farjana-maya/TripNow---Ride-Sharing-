import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Star, DollarSign, Calendar, Plus, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RideBookingForm from '../components/RideBookingForm';
import RideStatus from './RideStatus';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  // Poll for ride status changes
  useEffect(() => {
    if (!activeRide) return;

    const pollInterval = setInterval(async () => {
      await checkActiveRideStatus();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [activeRide]);

  const checkActiveRideStatus = async () => {
    if (!activeRide) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/rides/${activeRide.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.ride) {
        const updatedRide = data.ride;
        
        // If driver accepted the ride, redirect to RideAcceptedPage
        if (updatedRide.status === 'accepted' && activeRide.status !== 'accepted') {
          navigate('/ride/accepted', { state: { ride: updatedRide } });
          return;
        }

        // Update the active ride state
        setActiveRide(updatedRide);
        handleRideUpdate(updatedRide);
      }
    } catch (error) {
      console.error('Error checking ride status:', error);
    }
  };

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login to access your dashboard');
        setLoading(false);
        return;
      }

      // Get user info
      const userResponse = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.user);
        if (userData.user.role !== 'user') {
          setError('This dashboard is for riders only');
          setLoading(false);
          return;
        }
      } else {
        setError('Authentication failed. Please login again.');
        setLoading(false);
        return;
      }

      // Load rides
      await loadRides();
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  const loadRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/rides', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRides(data.rides.data || []);
        // Find active ride (not completed or cancelled)
        const active = data.rides.data.find(ride =>
          !['completed', 'cancelled'].includes(ride.status)
        );
        setActiveRide(active || null);
      } else {
        setError(data.message || 'Failed to load rides');
      }
    } catch (error) {
      console.error('Error loading rides:', error);
      setError('Network error while loading rides');
    } finally {
      setLoading(false);
    }
  };

  const handleRideBooked = (newRide) => {
    setRides(prev => [newRide, ...prev]);
    setActiveRide(newRide);
    setShowBookingForm(false);
  };

  const handleRideUpdate = (updatedRide) => {
    setRides(prev => prev.map(ride =>
      ride.id === updatedRide.id ? updatedRide : ride
    ));

    // Update active ride if it's the one being updated
    if (activeRide && activeRide.id === updatedRide.id) {
      setActiveRide(updatedRide);
    }

    // Clear active ride if completed or cancelled
    if (['completed', 'cancelled'].includes(updatedRide.status)) {
      setActiveRide(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      accepted: 'bg-purple-100 text-purple-800',
      arrived: 'bg-indigo-100 text-indigo-800',
      started: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your rider dashboard.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">Manage your rides and book new ones</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Book New Ride</span>
          </button>
        </div>

        {/* Active Ride */}
        {activeRide && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Ride</h2>
            <RideStatus
              rideId={activeRide.id}
              onRideUpdate={handleRideUpdate}
            />
          </div>
        )}

        {/* Recent Rides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Rides</h2>
            <button
              onClick={() => window.location.href = '/ride-history'}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              View All →
            </button>
          </div>

          {rides.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides yet</h3>
              <p className="text-gray-600 mb-6">Book your first ride to get started!</p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Book Your First Ride
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rides.slice(0, 6).map((ride) => (
                <div key={ride.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Ride #{ride.ride_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(ride.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ride.status)}`}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 truncate">{ride.pickup_location}</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 truncate">{ride.drop_location}</p>
                    </div>
                  </div>

                  {ride.total_fare && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Fare</span>
                      <span className="font-semibold text-gray-900">${ride.total_fare}</span>
                    </div>
                  )}

                  {ride.status === 'completed' && !ride.review && (
                    <div className="pt-4 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        Rate this ride
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Book New Ride</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RideBookingForm
                  onRideBooked={handleRideBooked}
                  onCancel={() => setShowBookingForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
