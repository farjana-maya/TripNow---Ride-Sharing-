import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Star, Phone, User, Navigation, CheckCircle, XCircle, Loader, ArrowRight, DollarSign, Hash, Calendar, Palette } from 'lucide-react';

// Main App Component
const RideFlowApp = () => {
  const [currentView, setCurrentView] = useState('driverForm'); // driverForm, searching, accepted, completed
  const [rideData, setRideData] = useState(null);
  const [driverData, setDriverData] = useState(null);

  const navigateTo = (view, data = null) => {
    setCurrentView(view);
    if (data) {
      if (data.ride) setRideData(data.ride);
      if (data.driver) setDriverData(data.driver);
    }
  };

  return (
    <div>
      {currentView === 'driverForm' && <DriverRegistrationForm onSubmit={(data) => navigateTo('searching', { ride: data })} />}
      {currentView === 'searching' && <SearchingDriverPage ride={rideData} onDriverFound={(data) => navigateTo('accepted', data)} />}
      {currentView === 'accepted' && <RideAcceptedPage ride={rideData} onComplete={() => navigateTo('completed', { ride: rideData })} />}
      {currentView === 'completed' && <RideCompletedPage ride={rideData} onHome={() => navigateTo('driverForm')} />}
    </div>
  );
};

// 1. Driver Registration Form with Vehicle Type Selection
const DriverRegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    license_number: '',
    license_expiry: '',
    vehicle_type: '',
    vehicle_model: '',
    vehicle_number: '',
    vehicle_color: '',
    vehicle_year: '',
    nid_number: '',
    nid_copy: null,
    license_paper: null,
    vehicle_documents: []
  });
  const [errors, setErrors] = useState({});

  const vehicleTypes = [
    { id: 'standard', name: 'TripNow Standard', icon: '🚗', capacity: '4 seats', description: 'Affordable rides' },
    { id: 'premium', name: 'TripNow Premium', icon: '✨', capacity: '4 seats', description: 'Premium cars' },
    { id: 'suv', name: 'TripNow SUV', icon: '🚙', capacity: '6 seats', description: 'Extra space' },
    { id: 'bike', name: 'TripNow Bike', icon: '🏍️', capacity: '1 seat', description: 'Quick & economical' }
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (name === 'vehicle_documents') {
        setFormData(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate ride booking
    const mockRide = {
      id: Math.floor(Math.random() * 10000),
      ride_number: 'TN' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      pickup_location: 'Dhanmondi 27, Dhaka',
      drop_location: 'Gulshan 2, Dhaka',
      vehicle_type: formData.vehicle_type,
      scheduled_at: new Date().toISOString(),
      status: 'pending'
    };
    
    onSubmit(mockRide);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent mb-2">
            TripNow Driver Registration
          </h1>
          <p className="text-gray-600">Complete your profile to start accepting rides</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* License Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Hash className="text-blue-600" size={16} />
                </div>
                <span>License Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="DL-1420110012345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Expiry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="license_expiry"
                    value={formData.license_expiry}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Car className="text-emerald-600" size={16} />
                </div>
                <span>Vehicle Type</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vehicleTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicle_type: type.id }))}
                    className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                      formData.vehicle_type === type.id
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div className="text-sm font-bold text-gray-900">{type.name.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600 mt-1">{type.capacity}</div>
                  </button>
                ))}
              </div>
              {!formData.vehicle_type && (
                <p className="mt-2 text-sm text-red-600">Please select a vehicle type</p>
              )}
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="Toyota Corolla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="DHA-12-3456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_color"
                    value={formData.vehicle_color}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="White"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicle_year"
                    value={formData.vehicle_year}
                    onChange={handleChange}
                    required
                    min="2010"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>

            {/* NID Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Identity Information</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nid_number"
                  value={formData.nid_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="1234567890123"
                />
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Document Uploads</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NID Copy <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="nid_copy"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    License Paper <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="license_paper"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Submit & Book Test Ride</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 2. Searching Driver Page
const SearchingDriverPage = ({ ride, onDriverFound }) => {
  const [searchProgress, setSearchProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Simulate driver found after progress completes
          setTimeout(() => {
            onDriverFound({
              ride: {
                ...ride,
                status: 'accepted',
                driver: {
                  id: 1,
                  name: 'Karim Ahmed',
                  phone: '+880 1700-000000',
                  rating: 4.9,
                  vehicle_model: 'Toyota Corolla',
                  vehicle_number: 'DHA-123-456',
                  vehicle_color: 'White'
                }
              }
            });
          }, 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const searchingSteps = [
    { icon: MapPin, text: 'Notifying nearby drivers', delay: 0 },
    { icon: Car, text: 'Finding available vehicles', delay: 1000 },
    { icon: User, text: 'Waiting for driver acceptance', delay: 2000 },
  ];

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
                      <CheckCircle className="w-4 h-4 text-white" />
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

          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Pickup</p>
                  <p className="text-sm text-white font-medium">{ride.pickup_location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm mt-1"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Dropoff</p>
                  <p className="text-sm text-white font-medium">{ride.drop_location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Ride #{ride.ride_number} • Waiting for driver...
        </p>
      </div>
    </div>
  );
};

// 3. Ride Accepted Page (Rider View)
const RideAcceptedPage = ({ ride, onComplete }) => {
  const [currentRide, setCurrentRide] = useState(ride);
  const [estimatedTime, setEstimatedTime] = useState(5);

  useEffect(() => {
    // Simulate status changes
    const statusInterval = setInterval(() => {
      setCurrentRide(prev => {
        if (prev.status === 'accepted') {
          return { ...prev, status: 'arrived' };
        } else if (prev.status === 'arrived') {
          return { ...prev, status: 'started' };
        } else if (prev.status === 'started') {
          clearInterval(statusInterval);
          // Simulate ride completion after 5 seconds
          setTimeout(() => {
            onComplete();
          }, 5000);
          return { ...prev, status: 'completed' };
        }
        return prev;
      });
    }, 8000); // Change status every 8 seconds

    return () => clearInterval(statusInterval);
  }, []);

  const driver = currentRide.driver;

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
                <p className="text-sm opacity-90 mb-1">
                  {currentRide.status === 'accepted' && 'Your driver is on the way'}
                  {currentRide.status === 'arrived' && 'Driver has arrived!'}
                  {currentRide.status === 'started' && 'Ride in progress'}
                </p>
                <h2 className="text-3xl font-bold">
                  {currentRide.status === 'accepted' && `${estimatedTime} min`}
                  {currentRide.status === 'arrived' && 'Please board the vehicle'}
                  {currentRide.status === 'started' && 'En route to destination'}
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
                  {driver.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{driver.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-700">{driver.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">500+ trips</span>
                </div>
              </div>
              <button className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Car className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Model</p>
                <p className="font-bold text-gray-900 text-sm">{driver.vehicle_model}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl mb-1">🎨</p>
                <p className="text-xs text-gray-500 mb-1">Color</p>
                <p className="font-bold text-gray-900 text-sm">{driver.vehicle_color}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl mb-1">🔢</p>
                <p className="text-xs text-gray-500 mb-1">Plate</p>
                <p className="font-bold text-gray-900 text-sm">{driver.vehicle_number}</p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-semibold text-gray-900">{currentRide.pickup_location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-sm mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Drop-off Location</p>
                  <p className="font-semibold text-gray-900">{currentRide.drop_location}</p>
                </div>
              </div>
            </div>

            {/* Fare Info */}
            <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Estimated Fare</span>
                <span className="text-2xl font-bold text-emerald-600">৳350</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {currentRide.status === 'accepted' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Navigation className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Driver is on the way</h4>
                <p className="text-sm text-gray-600">Your driver is heading to the pickup location. Please be ready.</p>
              </div>
            </div>
          </div>
        )}

        {currentRide.status === 'arrived' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-200 animate-pulse">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Driver has arrived!</h4>
                <p className="text-sm text-gray-600">Your driver is waiting at the pickup location. Please board the vehicle.</p>
              </div>
            </div>
          </div>
        )}

        {currentRide.status === 'started' && (
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

// 4. Ride Completed Page (Thank You)
const RideCompletedPage = ({ ride, onHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Your ride has been completed successfully
          </p>

          {/* Trip Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-600">Ride Number</span>
              <span className="font-bold text-gray-900">#{ride.ride_number}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-600">Total Fare</span>
              <span className="text-2xl font-bold text-emerald-600">৳350</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Paid
              </span>
            </div>
          </div>

          {/* Rating Section */}
          <div className="bg-yellow-50 rounded-2xl p-6 mb-6 border border-yellow-200">
            <h3 className="font-bold text-gray-900 mb-3">Rate Your Experience</h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="w-12 h-12 hover:scale-110 transition-transform"
                >
                  <Star className="w-full h-full text-yellow-400 fill-current" />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">How was your ride with {ride.driver?.name}?</p>
          </div>

          {/* Actions */}
          <button
            onClick={onHome}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] mb-3"
          >
            Book Another Ride
          </button>

          <button className="w-full py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors">
            View Ride History
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-center text-white text-sm mt-6">
          We appreciate your business! 🚗💨
        </p>
      </div>
    </div>
  );
};

export default RideFlowApp;