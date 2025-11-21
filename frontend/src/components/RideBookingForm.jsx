import React, { useState } from 'react';
import { MapPin, Clock, Car, Navigation, DollarSign, MessageSquare } from 'lucide-react';

const RideBookingForm = ({ onRideBooked }) => {
  const [formData, setFormData] = useState({
    pickup_location: '',
    pickup_latitude: '',
    pickup_longitude: '',
    drop_location: '',
    drop_latitude: '',
    drop_longitude: '',
    ride_type: 'sedan',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rideTypes = [
    { value: 'sedan', label: 'Sedan', price: '$15-25' },
    { value: 'suv', label: 'SUV', price: '$20-35' },
    { value: 'hatchback', label: 'Hatchback', price: '$12-20' },
    { value: 'luxury', label: 'Luxury', price: '$30-50' },
    { value: 'bike', label: 'Bike', price: '$8-15' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (type, location) => {
    // This would integrate with a map service like Google Maps
    setFormData(prev => ({
      ...prev,
      [`${type}_location`]: location.address,
      [`${type}_latitude`]: location.lat,
      [`${type}_longitude`]: location.lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login to book a ride');
        return;
      }

      const response = await fetch('http://localhost:8000/api/rides/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (onRideBooked) {
          onRideBooked(data.ride);
        }
        // Reset form
        setFormData({
          pickup_location: '',
          pickup_latitude: '',
          pickup_longitude: '',
          drop_location: '',
          drop_latitude: '',
          drop_longitude: '',
          ride_type: 'sedan',
          notes: ''
        });
      } else {
        setError(data.message || 'Failed to book ride');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Ride</h2>
        <p className="text-gray-600">Enter your pickup and drop-off locations</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pickup Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleInputChange}
              placeholder="Enter pickup address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Drop-off Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Drop-off Location
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="drop_location"
              value={formData.drop_location}
              onChange={handleInputChange}
              placeholder="Enter destination address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Ride Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rideTypes.map((type) => (
              <label key={type.value} className="relative">
                <input
                  type="radio"
                  name="ride_type"
                  value={type.value}
                  checked={formData.ride_type === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.ride_type === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Car className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-semibold text-green-600">{type.price}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{type.label}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions for the driver..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Booking Ride...</span>
            </>
          ) : (
            <>
              <Car className="h-5 w-5" />
              <span>Book Ride</span>
            </>
          )}
        </button>
      </form>

      {/* Map Placeholder */}
      <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Interactive map will be integrated here</p>
        <p className="text-sm text-gray-500 mt-1">Click on locations to select pickup/drop-off points</p>
      </div>
    </div>
  );
};

export default RideBookingForm;
