import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Star, DollarSign, Calendar, Filter, ChevronDown } from 'lucide-react';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRideHistory();
  }, [filter]);

  const loadRideHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login to view ride history');
        return;
      }

      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`http://localhost:8000/api/rides?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRides(data.rides.data);
      } else {
        setError(data.message || 'Failed to load ride history');
      }
    } catch (error) {
      console.error('Error loading ride history:', error);
      setError('Network error');
    } finally {
      setLoading(false);
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterOptions = [
    { value: 'all', label: 'All Rides' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'started', label: 'In Progress' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ride History</h1>
          <p className="text-gray-600">View all your past and current rides</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filter: {filterOptions.find(opt => opt.value === filter)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setShowFilters(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              {rides.length} ride{rides.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Rides List */}
        {rides.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-600">
              {filter === 'all' ? "You haven't taken any rides yet." : `No ${filter} rides found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Ride #{ride.ride_number}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(ride.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ride.status)}`}>
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </span>
                      {ride.total_fare && (
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ${ride.total_fare}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="text-gray-900">{ride.pickup_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="text-gray-900">{ride.drop_location}</p>
                      </div>
                    </div>
                  </div>

                  {ride.driver && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {ride.driver.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{ride.driver.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{ride.ride_type}</p>
                        </div>
                      </div>

                      {ride.review && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold text-gray-900">{ride.review.rating}</span>
                        </div>
                      )}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
