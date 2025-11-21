import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, User, Phone, Star, Navigation, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const RideStatus = ({ rideId, onRideUpdate }) => {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rideId) {
      loadRideStatus();
      // Set up polling for real-time updates
      const interval = setInterval(loadRideStatus, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [rideId]);

  const loadRideStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/rides/${rideId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        setError('Ride not found');
        setRide(null);
      } else if (response.status === 403) {
        setError('Access denied to this ride');
        setRide(null);
      } else {
        const data = await response.json();

        if (data.success) {
          setRide(data.ride);
          setError('');
          if (onRideUpdate) {
            onRideUpdate(data.ride);
          }
        } else {
          setError(data.message || 'Failed to load ride status');
          setRide(null);
        }
      }
    } catch (error) {
      console.error('Error loading ride status:', error);
      setError('Network error. Please check your connection.');
      setRide(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        text: 'Finding Driver',
        description: 'We\'re finding the best driver for you'
      },
      assigned: {
        icon: User,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        text: 'Driver Assigned',
        description: 'Your driver is on the way'
      },
      accepted: {
        icon: Car,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        text: 'Driver Accepted',
        description: 'Driver has accepted your ride'
      },
      arrived: {
        icon: MapPin,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        text: 'Driver Arrived',
        description: 'Your driver has arrived at pickup location'
      },
      started: {
        icon: Navigation,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        text: 'Ride Started',
        description: 'Enjoy your journey!'
      },
      completed: {
        icon: CheckCircle,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        text: 'Ride Completed',
        description: 'Thank you for riding with us!'
      },
      cancelled: {
        icon: XCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        text: 'Ride Cancelled',
        description: 'This ride has been cancelled'
      }
    };

    return statusConfig[status] || statusConfig.pending;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride status...</p>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Ride</h3>
          <p className="text-gray-600">{error || 'Ride information is not available'}</p>
          <button
            onClick={loadRideStatus}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(ride.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${statusInfo.bgColor} border-b ${statusInfo.borderColor}`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
            <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{statusInfo.text}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup & Drop-off */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-semibold text-gray-900">{ride.pickup_location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Navigation className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Drop-off</p>
                <p className="font-semibold text-gray-900">{ride.drop_location}</p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {ride.driver && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{ride.driver.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 capitalize">{ride.vehicle_type || ride.ride_type}</span>
              </div>

              {ride.driver.phone && (
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  <Phone className="h-4 w-4" />
                  <span>Call Driver</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Ride Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Ride ID</p>
            <p className="font-semibold text-gray-900">{ride.ride_number}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold text-gray-900">{ride.distance ? `${ride.distance} km` : 'Calculating...'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold text-gray-900">{ride.duration ? `${ride.duration} min` : 'Calculating...'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Fare</p>
            <p className="font-semibold text-gray-900">{ride.total_fare ? `$${ride.total_fare}` : 'Calculating...'}</p>
          </div>
        </div>

        {/* Scheduled Time */}
        {ride.scheduled_at && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Scheduled Time</p>
                <p className="font-semibold text-gray-900">
                  {new Date(ride.scheduled_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="mt-6 bg-gray-100 rounded-lg p-8 text-center">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Live Ride Tracking</p>
          <p className="text-sm text-gray-500 mt-2">
            {ride.status === 'started' ? 'Track your driver in real-time' : 'Map will show driver location during ride'}
          </p>
        </div>

        {/* Action Buttons */}
        {ride.status === 'completed' && !ride.review && (
          <div className="mt-6 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Rate Your Ride
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideStatus;
