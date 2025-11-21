import React, { useState, useEffect } from 'react';
import { MapPin, Car, User, Navigation, DollarSign, Clock, RefreshCw, Filter, Maximize2 } from 'lucide-react';

const LiveRidesMap = () => {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadLiveRides();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadLiveRides();
      }, 5000); // Refresh every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadLiveRides = async () => {
    try {
      // Simulated data - Replace with actual API call
      const mockRides = [
        {
          id: 1,
          rider: { name: 'John Doe', phone: '+1234567890' },
          driver: {
            name: 'Mike Smith',
            phone: '+0987654321',
            vehicle: 'Sedan',
            number: 'ABC 123',
            location: { lat: 23.8103, lng: 90.4125 }
          },
          pickup: { lat: 23.8103, lng: 90.4125, address: '123 Main St, Dhaka' },
          dropoff: { lat: 23.7500, lng: 90.3753, address: '456 Park Ave, Dhaka' },
          fare: 250,
          distance: 8.5,
          started_at: '2025-10-08T14:30:00',
          estimated_duration: 25,
        },
        {
          id: 2,
          rider: { name: 'Jane Smith', phone: '+1122334455' },
          driver: {
            name: 'Bob Johnson',
            phone: '+5544332211',
            vehicle: 'SUV',
            number: 'XYZ 789',
            location: { lat: 23.7500, lng: 90.3753 }
          },
          pickup: { lat: 23.7500, lng: 90.3753, address: '789 Center Rd, Dhaka' },
          dropoff: { lat: 23.8000, lng: 90.4200, address: '321 North St, Dhaka' },
          fare: 180,
          distance: 5.2,
          started_at: '2025-10-08T14:45:00',
          estimated_duration: 15,
        },
      ];
      
      setRides(mockRides);
      setLoading(false);
    } catch (error) {
      console.error('Error loading live rides:', error);
      setLoading(false);
    }
  };

  const getElapsedTime = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000 / 60); // minutes
    return `${diff} min`;
  };

  const RideCard = ({ ride }) => (
    <div 
      onClick={() => setSelectedRide(ride)}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        selectedRide?.id === ride.id
          ? 'bg-cyan-500/20 border-cyan-500'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Car className="text-white" size={20} />
          </div>
          <div>
            <p className="text-white font-semibold">Ride #{ride.id}</p>
            <p className="text-xs text-gray-400">{ride.driver.vehicle} • {ride.driver.number}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
          LIVE
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start space-x-2">
          <MapPin size={14} className="text-cyan-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Pickup</p>
            <p className="text-sm text-white truncate">{ride.pickup.address}</p>
          </div>
        </div>
        <div className="flex items-start space-x-2">
          <Navigation size={14} className="text-purple-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Dropoff</p>
            <p className="text-sm text-white truncate">{ride.dropoff.address}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs text-gray-400">{getElapsedTime(ride.started_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign size={14} className="text-yellow-400" />
            <span className="text-xs text-white font-semibold">{ride.fare}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{ride.distance} km</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <span>Live Rides Tracking</span>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </h2>
            <p className="text-gray-400 mt-1">{rides.length} active rides in progress</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                autoRefresh
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              <RefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">Auto Refresh</span>
            </button>

            <button
              onClick={loadLiveRides}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw size={16} />
              <span className="text-sm font-medium">Refresh Now</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rides List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Active Rides</h3>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Filter size={16} className="text-gray-400" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 text-sm mt-2">Loading rides...</p>
                </div>
              ) : rides.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="mx-auto text-gray-600 mb-2" size={32} />
                  <p className="text-gray-400">No active rides</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                  {rides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map & Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-800 overflow-hidden">
              {/* Map Placeholder */}
              <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-gray-700"></div>
                    ))}
                  </div>
                </div>
                
                {/* Simulated Map Markers */}
                {rides.map((ride, index) => (
                  <div
                    key={ride.id}
                    className="absolute animate-pulse"
                    style={{
                      top: `${20 + index * 15}%`,
                      left: `${30 + index * 20}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500 rounded-full blur-lg opacity-50"></div>
                      <div className="relative w-8 h-8 bg-cyan-500 rounded-full border-4 border-white flex items-center justify-center">
                        <Car size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center z-10">
                  <MapPin size={48} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 font-semibold">Map View</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Integrate Google Maps API for live tracking
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Add GOOGLE_MAPS_API_KEY to enable map features
                  </p>
                </div>

                <button className="absolute top-4 right-4 p-2 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 rounded-lg transition-colors">
                  <Maximize2 size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Selected Ride Details */}
              {selectedRide && (
                <div className="p-6 border-t border-gray-800">
                  <h3 className="text-white font-bold mb-4">Ride Details</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Rider Info */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Rider</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{selectedRide.rider.name}</p>
                          <p className="text-xs text-gray-400">{selectedRide.rider.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Driver</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Car className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{selectedRide.driver.name}</p>
                          <p className="text-xs text-gray-400">
                            {selectedRide.driver.vehicle} • {selectedRide.driver.number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Distance</p>
                      <p className="text-white font-bold">{selectedRide.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Fare</p>
                      <p className="text-white font-bold">${selectedRide.fare}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-white font-bold">{getElapsedTime(selectedRide.started_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">ETA</p>
                      <p className="text-white font-bold">{selectedRide.estimated_duration} min</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-6">
                    <button className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors font-medium">
                      Track Route
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors font-medium">
                      Contact Driver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRidesMap;