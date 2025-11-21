import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Car, Star, Calendar, AlertCircle, CheckCircle, XCircle, Loader, Navigation, DollarSign, User, ChevronRight, Zap, Shield, Check, Menu, Bell, Package, Bike, MapPin as MapPinIcon, Search, X as XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RidePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [searchingDriver, setSearchingDriver] = useState(false);
  const [showRideAccepted, setShowRideAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState('ride');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  
  // Map and location state
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [currentLocation, setCurrentLocation] = useState([23.8103, 90.4125]);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    pickup_location: '',
    pickup_latitude: null,
    pickup_longitude: null,
    dropoff_location: '',
    dropoff_latitude: null,
    dropoff_longitude: null,
    scheduled_at: '',
    vehicle_type: 'standard',
    notes: ''
  });

  // Vehicle types with pricing
  const vehicles = [
    {
      id: 'standard',
      name: 'TripNow Standard',
      icon: '🚗',
      capacity: '4 seats',
      description: 'Affordable rides for everyday use',
      baseFare: 50,
      perKmRate: 15,
      perMinRate: 2,
      eta: '2-5 min',
      features: ['Comfortable', 'AC']
    },
    {
      id: 'premium',
      name: 'TripNow Premium',
      icon: '✨',
      capacity: '4 seats',
      description: 'Premium cars with top-rated drivers',
      baseFare: 75,
      perKmRate: 22,
      perMinRate: 3,
      eta: '3-7 min',
      features: ['Luxury', 'AC', 'WiFi']
    },
    {
      id: 'suv',
      name: 'TripNow SUV',
      icon: '🚙',
      capacity: '6 seats',
      description: 'Extra space for groups',
      baseFare: 100,
      perKmRate: 30,
      perMinRate: 4,
      eta: '4-8 min',
      features: ['Spacious', 'AC', '6 Seats']
    },
    {
      id: 'bike',
      name: 'TripNow Bike',
      icon: '🏍️',
      capacity: '1 seat',
      description: 'Quick and economical',
      baseFare: 25,
      perKmRate: 8,
      perMinRate: 1,
      eta: '1-3 min',
      features: ['Fast', 'Economical']
    }
  ];

  // Load Leaflet dynamically
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Leaflet loaded successfully');
      // Initialize map after script loads
      setTimeout(() => {
        if (mapRef.current && !map) {
          initializeMap();
        }
      }, 500);
    };
    
    script.onerror = () => {
      console.error('Failed to load Leaflet');
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (link.parentNode) link.parentNode.removeChild(link);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (map && map.remove) {
        map.remove();
        setMap(null);
      }
    };
  }, [map]);

  useEffect(() => {
    checkAuthAndLoadData();
    getUserLocation();
    const interval = setInterval(loadActiveRide, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bookingForm.pickup_latitude && bookingForm.dropoff_latitude) {
      fetchRouteAndCalculateFare();
    }
  }, [bookingForm.pickup_latitude, bookingForm.dropoff_latitude, bookingForm.vehicle_type]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || map || !window.L) {
      console.log('Map init conditions not met:', { hasRef: !!mapRef.current, hasMap: !!map, hasLeaflet: !!window.L });
      return;
    }

    try {
      console.log('Initializing map...');
      
      // Initialize Leaflet map with MapTiler tiles
      const leafletMap = window.L.map(mapRef.current, {
        center: currentLocation,
        zoom: 13,
        zoomControl: false
      });

      // Add MapTiler tile layer
      window.L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=aO6nOQBlaT2H64sVvHOB', {
        attribution: '© MapTiler © OpenStreetMap contributors',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1
      }).addTo(leafletMap);

      console.log('Map initialized successfully');
      setMap(leafletMap);

      // Custom marker icons
      const pickupIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const dropoffIcon = window.L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="16" height="16" fill="white" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8"/></svg></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add click handler for map
      leafletMap.on('click', async (e) => {
        const { lat, lng } = e.latlng;

        if (!bookingForm.pickup_location) {
          // Set pickup
          const address = await reverseGeocode(lat, lng);
          setBookingForm(prev => ({
            ...prev,
            pickup_location: address,
            pickup_latitude: lat,
            pickup_longitude: lng
          }));

          if (pickupMarker) {
            leafletMap.removeLayer(pickupMarker);
          }
          const marker = window.L.marker([lat, lng], { icon: pickupIcon }).addTo(leafletMap);
          setPickupMarker(marker);
        } else if (!bookingForm.dropoff_location) {
          // Set dropoff
          const address = await reverseGeocode(lat, lng);
          setBookingForm(prev => ({
            ...prev,
            dropoff_location: address,
            dropoff_latitude: lat,
            dropoff_longitude: lng
          }));

          if (dropoffMarker) {
            leafletMap.removeLayer(dropoffMarker);
          }
          const marker = window.L.marker([lat, lng], { icon: dropoffIcon }).addTo(leafletMap);
          setDropoffMarker(marker);
        }
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      
      // Fallback to static map display
      const mapContainer = mapRef.current;
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; color: white; z-index: 10;">
              <div style="font-size: 64px; margin-bottom: 20px;">🗺️</div>
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Loading Interactive Map...</div>
              <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px;">Powered by MapTiler</div>
              <div style="font-size: 14px; opacity: 0.7;">Please wait while we load the map</div>
            </div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background: white; border: 4px solid #667eea; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>
          </div>
        `;
      }
      
      setMap({ initialized: true, fallback: true });
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=aO6nOQBlaT2H64sVvHOB`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const searchLocation = async (query, type) => {
    if (!query || query.length < 3) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=aO6nOQBlaT2H64sVvHOB&country=BD`
      );
      const data = await response.json();
      
      if (data.features) {
        const suggestions = data.features.map(feature => ({
          address: feature.place_name,
          lat: feature.center[1],
          lon: feature.center[0]
        }));
        
        if (type === 'pickup') {
          setPickupSuggestions(suggestions);
          setShowPickupSuggestions(true);
        } else {
          setDropoffSuggestions(suggestions);
          setShowDropoffSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const selectLocation = (suggestion, type) => {
    if (type === 'pickup') {
      setBookingForm(prev => ({
        ...prev,
        pickup_location: suggestion.address,
        pickup_latitude: suggestion.lat,
        pickup_longitude: suggestion.lon
      }));
      setShowPickupSuggestions(false);
      
      if (map && map.remove) {
        if (pickupMarker) map.removeLayer(pickupMarker);
        
        const pickupIcon = window.L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        const marker = window.L.marker([suggestion.lat, suggestion.lon], { icon: pickupIcon }).addTo(map);
        setPickupMarker(marker);
        map.setView([suggestion.lat, suggestion.lon], 14);
      }
    } else {
      setBookingForm(prev => ({
        ...prev,
        dropoff_location: suggestion.address,
        dropoff_latitude: suggestion.lat,
        dropoff_longitude: suggestion.lon
      }));
      setShowDropoffSuggestions(false);
      
      if (map && map.remove) {
        if (dropoffMarker) map.removeLayer(dropoffMarker);
        
        const dropoffIcon = window.L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><svg width="16" height="16" fill="white" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8"/></svg></div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        
        const marker = window.L.marker([suggestion.lat, suggestion.lon], { icon: dropoffIcon }).addTo(map);
        setDropoffMarker(marker);
      }
    }
  };

  const fetchRouteAndCalculateFare = async () => {
    const { pickup_latitude, pickup_longitude, dropoff_latitude, dropoff_longitude, vehicle_type } = bookingForm;
    
    if (!pickup_latitude || !dropoff_latitude) return;

    try {
      // Calculate straight-line distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = (dropoff_latitude - pickup_latitude) * Math.PI / 180;
      const dLon = (dropoff_longitude - pickup_longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(pickup_latitude * Math.PI / 180) * Math.cos(dropoff_latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distanceKm = (R * c * 1.3).toFixed(2); // Add 30% for road routing
      const durationMin = Math.round(distanceKm * 2.5); // Estimate 2.5 min per km

      setDistance(distanceKm);
      setDuration(durationMin);

      // Draw straight line on map
      if (map && map.remove) {
        if (routePolyline) {
          map.removeLayer(routePolyline);
        }
        
        const coordinates = [[pickup_latitude, pickup_longitude], [dropoff_latitude, dropoff_longitude]];
        const polyline = window.L.polyline(coordinates, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);
        setRoutePolyline(polyline);

        // Fit map to show entire route
        const bounds = window.L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Calculate fare
      const selectedVehicle = vehicles.find(v => v.id === vehicle_type);
      const fare = selectedVehicle.baseFare + 
                  (distanceKm * selectedVehicle.perKmRate) + 
                  (durationMin * selectedVehicle.perMinRate);

      setEstimatedFare(fare.toFixed(2));
      setEstimatedTime(durationMin);
    } catch (error) {
      console.error('Route calculation error:', error);
    }
  };

  const clearLocation = (type) => {
    if (type === 'pickup') {
      setBookingForm(prev => ({
        ...prev,
        pickup_location: '',
        pickup_latitude: null,
        pickup_longitude: null
      }));
      if (map && map.remove && pickupMarker) {
        map.removeLayer(pickupMarker);
        setPickupMarker(null);
      }
    } else {
      setBookingForm(prev => ({
        ...prev,
        dropoff_location: '',
        dropoff_latitude: null,
        dropoff_longitude: null
      }));
      if (map && map.remove && dropoffMarker) {
        map.removeLayer(dropoffMarker);
        setDropoffMarker(null);
      }
    }
    
    if (map && map.remove && routePolyline) {
      map.removeLayer(routePolyline);
      setRoutePolyline(null);
    }
    setDistance(null);
    setDuration(null);
    setEstimatedFare(null);
  };

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login to access this page');
        setLoading(false);
        return;
      }

      const userResponse = await fetch('http://localhost:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.user);
        if (userData.user.role !== 'user') {
          setError('This page is for riders only');
          setLoading(false);
          return;
        }
      }

      await loadActiveRide();
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  const loadActiveRide = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/rides?status=pending,assigned,accepted,arrived,started', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const rides = data.rides.data || [];
        const active = rides.find(ride =>
          !['completed', 'cancelled'].includes(ride.status)
        );
        setActiveRide(active || null);
      }
    } catch (error) {
      console.error('Error loading active ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationInput = (e, type) => {
    const value = e.target.value;
    
    if (type === 'pickup') {
      setBookingForm(prev => ({ ...prev, pickup_location: value }));
      searchLocation(value, 'pickup');
    } else {
      setBookingForm(prev => ({ ...prev, dropoff_location: value }));
      searchLocation(value, 'dropoff');
    }
  };

  const validateForm = () => {
    const { pickup_location, dropoff_location, vehicle_type, pickup_latitude, dropoff_latitude } = bookingForm;
    if (!pickup_location.trim() || !pickup_latitude) return 'Please select a valid pickup location';
    if (!dropoff_location.trim() || !dropoff_latitude) return 'Please select a valid drop-off location';
    if (!vehicle_type) return 'Vehicle type is required';
    return null;
  };

  const handleBookingSubmit = async () => {
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setBookingLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      // Prepare booking data with calculated values
      const bookingData = {
        pickup_location: bookingForm.pickup_location.trim(),
        pickup_latitude: parseFloat(bookingForm.pickup_latitude),
        pickup_longitude: parseFloat(bookingForm.pickup_longitude),
        dropoff_location: bookingForm.dropoff_location.trim(),
        dropoff_latitude: parseFloat(bookingForm.dropoff_latitude),
        dropoff_longitude: parseFloat(bookingForm.dropoff_longitude),
        vehicle_type: bookingForm.vehicle_type,
        notes: bookingForm.notes || '',
        scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        total_fare: estimatedFare ? parseFloat(estimatedFare) : 100,
        distance: distance ? parseFloat(distance) : 5,
        duration: duration ? parseInt(duration) : 15
      };
      
      console.log('Sending booking data:', bookingData);
      
      const response = await fetch('http://localhost:8000/api/rides/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log('Booking response:', { status: response.status, data });

      if (response.ok && data.success) {
        // Navigate to searching driver page with ride data
        navigate('/ride/searching', { state: { ride: data.ride } });
      } else {
        console.error('Booking error:', data);
        setError(data.message || data.errors || 'Failed to book ride. Please try again.');
        setBookingLoading(false);
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      setError('Network error. Please check your connection and try again.');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (searchingDriver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Finding Your Driver</h2>
          <p className="text-gray-400 mb-6">Matching you with the best available driver...</p>
          <div className="space-y-3">
            {['Analyzing your route', 'Finding nearby drivers', 'Confirming availability'].map((text, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showRideAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ride Booked!</h2>
          <p className="text-gray-600 text-lg mb-6">Your ride has been confirmed successfully.</p>
          <div className="animate-pulse">
            <Loader className="w-8 h-8 text-emerald-500 mx-auto animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-black text-gray-900 cursor-pointer" onClick={() => navigate('/')}>TripNow</h1>
                <nav className="hidden md:flex space-x-1">
                  <button className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-900 bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <Car size={18} />
                      <span>Ride</span>
                    </div>
                  </button>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar */}
          <div className="w-full md:w-[400px] lg:w-[450px] bg-white overflow-y-auto border-r border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get a ride</h2>

              {activeRide && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="text-emerald-600" size={20} />
                    <p className="font-semibold text-emerald-900">Active Ride</p>
                  </div>
                  <p className="text-sm text-emerald-700 mb-3">You have an ongoing ride</p>
                  <button
                    onClick={() => navigate('/rider/dashboard')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    View Details →
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Booking Form */}
              <div className="space-y-4">
                {/* Pickup Location */}
                <div className="relative">
                  <div className="absolute left-4 top-4 w-3 h-3 bg-gray-900 rounded-full z-10"></div>
                  <input
                    type="text"
                    value={bookingForm.pickup_location}
                    onChange={(e) => handleLocationInput(e, 'pickup')}
                    onFocus={() => setShowPickupSuggestions(true)}
                    placeholder="Pickup location"
                    className="w-full pl-10 pr-10 py-4 bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-gray-900 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none transition-all font-medium"
                  />
                  {bookingForm.pickup_location && (
                    <button
                      onClick={() => clearLocation('pickup')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <XIcon size={16} className="text-gray-600" />
                    </button>
                  )}
                  
                  {showPickupSuggestions && pickupSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectLocation(suggestion, 'pickup')}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-0"
                        >
                          <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-900">{suggestion.address}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropoff Location */}
                <div className="relative">
                  <div className="absolute left-4 top-4 w-3 h-3 bg-gray-900 rounded-sm z-10"></div>
                  <input
                    type="text"
                    value={bookingForm.dropoff_location}
                    onChange={(e) => handleLocationInput(e, 'dropoff')}
                    onFocus={() => setShowDropoffSuggestions(true)}
                    placeholder="Dropoff location"
                    className="w-full pl-10 pr-10 py-4 bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-gray-900 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none transition-all font-medium"
                  />
                  {bookingForm.dropoff_location && (
                    <button
                      onClick={() => clearLocation('dropoff')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                    >
                      <XIcon size={16} className="text-gray-600" />
                    </button>
                  )}
                  
                  {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {dropoffSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectLocation(suggestion, 'dropoff')}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-0"
                        >
                          <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-900">{suggestion.address}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Schedule Time */}
                <div className="relative">
                  <Clock className="absolute left-4 top-4 text-gray-900" size={16} />
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={bookingForm.scheduled_at}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-gray-900 rounded-lg text-gray-900 focus:outline-none transition-all font-medium"
                  />
                </div>

                {/* Distance and Duration Display */}
                {distance && duration && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Distance</p>
                        <p className="text-lg font-bold text-gray-900">{distance} km</p>
                      </div>
                      <div className="w-px h-10 bg-gray-300"></div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Duration</p>
                        <p className="text-lg font-bold text-gray-900">{duration} min</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle Selection */}
                {bookingForm.pickup_latitude && bookingForm.dropoff_latitude && (
                  <div className="space-y-3 pt-4">
                    <h3 className="font-semibold text-gray-900">Choose a ride</h3>
                    {vehicles.map((vehicle) => {
                      const vehicleFare = estimatedFare ? (
                        vehicle.baseFare + 
                        (parseFloat(distance) * vehicle.perKmRate) + 
                        (duration * vehicle.perMinRate)
                      ).toFixed(2) : null;

                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => setBookingForm(prev => ({ ...prev, vehicle_type: vehicle.id }))}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            bookingForm.vehicle_type === vehicle.id
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-3xl">{vehicle.icon}</div>
                              <div>
                                <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                                <p className="text-sm text-gray-600">{vehicle.eta} • {vehicle.capacity}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {vehicle.features.map((feature, idx) => (
                                    <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {vehicleFare && (
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">৳{vehicleFare}</p>
                                <p className="text-xs text-gray-500">Estimated</p>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Notes */}
                <textarea
                  name="notes"
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  placeholder="Add ride instructions (optional)"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-gray-900 rounded-lg focus:outline-none resize-none text-gray-900 placeholder-gray-600 transition-all"
                />

                {/* Book Button */}
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading || !bookingForm.pickup_latitude || !bookingForm.dropoff_latitude}
                  className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Ride</span>
                      {estimatedFare && <span>• ৳{estimatedFare}</span>}
                    </>
                  )}
                </button>

                {/* Payment Methods */}
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <span className="text-xs text-gray-500">Payment:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">💳</div>
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">💵</div>
                    <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">📱</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="flex-1 relative bg-gray-100">
            <div 
              ref={mapRef} 
              className="w-full h-full" 
              style={{ 
                minHeight: '500px',
                height: 'calc(100vh - 64px)',
                position: 'relative',
                zIndex: 1
              }}
            ></div>

            {/* Map Instructions */}
            {!bookingForm.pickup_latitude && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700">📍 Click on map to set pickup location</p>
              </div>
            )}

            {bookingForm.pickup_latitude && !bookingForm.dropoff_latitude && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700">📍 Click on map to set dropoff location</p>
              </div>
            )}

            {/* Route Info Card */}
            {distance && duration && estimatedFare && (
              <div className="absolute top-6 left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200 max-w-xs">
                <h3 className="font-bold text-gray-900 mb-3">Trip Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Distance</span>
                    <span className="font-semibold text-gray-900">{distance} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{duration} min</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Estimated Fare</span>
                    <span className="text-lg font-bold text-emerald-600">৳{estimatedFare}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
              <button
                onClick={() => {
                  if (map && map.setZoom) {
                    const currentZoom = map.getZoom();
                    map.setZoom(currentZoom + 1);
                  }
                }}
                className="w-10 h-10 bg-white hover:bg-gray-50 rounded-lg shadow-lg flex items-center justify-center transition-colors border border-gray-200"
              >
                <span className="text-xl font-bold text-gray-700">+</span>
              </button>
              <button
                onClick={() => {
                  if (map && map.setZoom) {
                    const currentZoom = map.getZoom();
                    map.setZoom(currentZoom - 1);
                  }
                }}
                className="w-10 h-10 bg-white hover:bg-gray-50 rounded-lg shadow-lg flex items-center justify-center transition-colors border border-gray-200"
              >
                <span className="text-xl font-bold text-gray-700">−</span>
              </button>
            </div>

            {/* Center on Location Button */}
            <button
              onClick={() => {
                if (currentLocation && map && map.setView) {
                  map.setView(currentLocation, 13);
                }
              }}
              className="absolute bottom-6 left-6 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg flex items-center justify-center transition-colors border border-gray-200"
            >
              <Navigation className="text-gray-700" size={20} />
            </button>

            {/* Map Attribution */}
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
              Map data ©2025 MapTiler
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          font-family: inherit;
          background: #e5e7eb;
        }

        .leaflet-tile-container {
          filter: brightness(1.0);
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }

        .leaflet-popup-content {
          margin: 12px;
          font-family: inherit;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          50% { 
            opacity: 0.7; 
            transform: translate(-50%, -50%) scale(0.95); 
          }
        }

        /* Hide suggestions when clicking outside */
        .suggestions-dropdown {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default RidePage;