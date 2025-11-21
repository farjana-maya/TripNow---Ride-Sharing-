import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Star, CheckCircle, XCircle, Loader, Check, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchingDriverPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride;
  const [searchState, setSearchState] = useState('searching');
  const [driver, setDriver] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!rideData) return;

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    const pollInterval = setInterval(async () => {
      await checkDriverAssignment();
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pollInterval);
    };
  }, [rideData]);

  const checkDriverAssignment = async () => {
    if (!rideData) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/rides/${rideData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        if (data.ride.status === 'accepted' && data.ride.driver) {
          setDriver(data.ride.driver);
          setSearchState('found');
          setTimeout(() => {
            navigate('/ride/accepted', { state: { ride: data.ride } });
          }, 2000);
        } else if (data.ride.status === 'cancelled') {
          setError('Ride was cancelled');
          setTimeout(() => {
            navigate('/ride');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error checking driver assignment:', error);
    }
  };

  const handleCancelRide = async () => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/rides/${rideData.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        navigate('/ride');
      } else {
        setError(data.message || 'Failed to cancel ride');
      }
    } catch (error) {
      console.error('Error cancelling ride:', error);
      setError('Network error. Please try again.');
    }
  };

  const searchingSteps = [
    { icon: MapPin, text: 'Notifying nearby drivers', delay: 0 },
    { icon: Car, text: 'Finding available vehicles', delay: 1000 },
    { icon: User, text: 'Waiting for driver acceptance', delay: 2000 },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % searchingSteps.length);
    }, 1500);

    return () => clearInterval(stepInterval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride Cancelled</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ride')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Book New Ride
          </button>
        </div>
      </div>
    );
  }

  if (searchState === 'found' && driver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mb-6">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Driver Found!</h2>
            <p className="text-gray-600 text-lg mb-6">Your ride is confirmed</p>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {driver.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{driver.name}</h3>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-gray-500 mb-1">Vehicle</p>
                  <p className="font-bold text-gray-900 capitalize">{rideData.vehicle_type}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-gray-500 mb-1">Arrives in</p>
                  <p className="font-bold text-emerald-600">3 mins</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white text-center text-sm">Redirecting to ride tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 text-center">Finding Your Driver</h2>
          <p className="text-gray-400 mb-8 text-center">Notifying available drivers near you...</p>

          <div className="mb-8">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${searchProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {searchingSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === activeStep;
              const isCompleted = idx < activeStep;

              return (
                <div 
                  key={idx}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                    isActive ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-gray-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-emerald-500' : isCompleted ? 'bg-emerald-500/50' : 'bg-gray-700'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {step.text}
                  </span>
                  {isActive && (
                    <Loader className="w-4 h-4 text-emerald-400 animate-spin ml-auto" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-700">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Pickup</p>
                  <p className="text-sm text-white font-medium">{rideData.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm mt-1"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Dropoff</p>
                  <p className="text-sm text-white font-medium">{rideData.drop_location}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCancelRide}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all border border-gray-700"
          >
            Cancel Search
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Ride #{rideData.ride_number} • Waiting for driver...
        </p>
      </div>
    </div>
  );
};

export default SearchingDriverPage;