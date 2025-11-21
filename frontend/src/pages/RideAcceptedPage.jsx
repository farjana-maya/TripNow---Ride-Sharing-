import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Star, Phone, User, Navigation, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const RideAcceptedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride;
  const [ride, setRide] = useState(rideData);
  const [estimatedTime, setEstimatedTime] = useState(5);

  useEffect(() => {
    if (!rideData) {
      navigate('/ride');
      return;
    }

    // Poll for ride status updates
    const pollInterval = setInterval(async () => {
      await checkRideStatus();
    }, 3000);

    // Countdown timer for estimated time
    const timeInterval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
    };
  }, [rideData]);

  const checkRideStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/rides/${rideData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRide(data.ride);
        
        // If ride is completed, redirect to completed page
        if (data.ride.status === 'completed') {
          navigate('/ride/completed', { state: { ride: data.ride } });
        }
      }
    } catch (error) {
      console.error('Error checking ride status:', error);
    }
  };

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  const driver = ride.driver || { name: 'Driver', phone: '' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Your Ride</h1>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Driver Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Your driver is on the way</p>
                <h2 className="text-3xl font-bold">
                  {ride.status === 'accepted' && `${estimatedTime} min`}
                  {ride.status === 'arrived' && 'Driver has arrived!'}
                  {ride.status === 'started' && 'Ride in progress'}
                </h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Car className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Driver Details */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{driver.name || 'Your Driver'}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-700">4.9</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{ride.vehicle_type || 'Standard'} Vehicle</span>
                </div>
                {driver.phone && (
                  <p className="text-sm text-gray-600 mt-1">{driver.phone}</p>
                )}
              </div>
              {driver.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <Phone className="w-6 h-6 text-white" />
                </a>
              )}
            </div>

            {/* Ride Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Car className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                <p className="font-bold text-gray-900 capitalize">{ride.vehicle_type || 'Standard'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl mb-1">💰</p>
                <p className="text-xs text-gray-500 mb-1">Fare</p>
                <p className="font-bold text-gray-900">৳{ride.total_fare || 0}</p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-semibold text-gray-900">{ride.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Drop-off Location</p>
                  <p className="font-semibold text-gray-900">{ride.drop_location}</p>
                </div>
              </div>
            </div>

            {/* Rider Info for Driver */}
            {ride.rider && (
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3">Passenger Information</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {ride.rider.name ? ride.rider.name.charAt(0).toUpperCase() : 'P'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{ride.rider.name || 'Passenger'}</p>
                    {ride.rider.phone && (
                      <p className="text-sm text-gray-600">{ride.rider.phone}</p>
                    )}
                  </div>
                  {ride.rider.phone && (
                    <a
                      href={`tel:${ride.rider.phone}`}
                      className="ml-auto w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {ride.status === 'accepted' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Navigation className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Driver is on the way</h4>
                <p className="text-sm text-gray-600">Your driver {driver.name || ''} is heading to the pickup location. Please be ready.</p>
              </div>
            </div>
          </div>
        )}

        {ride.status === 'arrived' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-200 animate-pulse">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Driver has arrived!</h4>
                <p className="text-sm text-gray-600">Your driver {driver.name || ''} is waiting at the pickup location. Please board the vehicle.</p>
              </div>
            </div>
          </div>
        )}

        {ride.status === 'started' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-start space-x-3">
              <Car className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Ride in progress</h4>
                <p className="text-sm text-gray-600">Enjoy your ride! We'll notify you when you're about to reach your destination.</p>
              </div>
            </div>
          </div>
        )}

        {/* Support */}
        <div className="mt-6 text-center">
          <button className="text-white hover:text-white/80 font-semibold transition-colors">
            Need help? Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideAcceptedPage;