import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Home, Car, MapPin, Clock, DollarSign, User, ChevronRight, Download } from 'lucide-react';

const RideCompletedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No ride data found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleRating = (value) => {
    setRating(value);
    // Here you would typically submit the rating to the backend
    console.log('Rating submitted:', value);
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  const downloadInvoice = async () => {
    // Dynamically import jsPDF
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const invoiceNumber = ride.ride_number || ride.id;
    const date = ride.completed_at ? new Date(ride.completed_at).toLocaleDateString() : new Date().toLocaleDateString();
    const distance = ride.distance ? parseFloat(ride.distance) : 0;
    const duration = ride.duration ? parseFloat(ride.duration) : 0;
    const totalFare = ride.total_fare ? parseFloat(ride.total_fare) : 0;
    
    // Calculate fare components
    const baseFare = 50;
    const distanceFare = distance * 15;
    const timeFare = duration * 2;
    const calculatedTotal = baseFare + distanceFare + timeFare;
    const actualTotal = totalFare > 0 ? totalFare : calculatedTotal;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('TripNow Invoice', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #${invoiceNumber}`, 20, 45);
    doc.text(`Date: ${date}`, 20, 55);
    
    // Trip Details
    doc.setFontSize(16);
    doc.text('Trip Details', 20, 75);
    doc.setFontSize(10);
    doc.text(`Pickup: ${ride.pickup_location}`, 20, 90);
    doc.text(`Drop-off: ${ride.drop_location}`, 20, 100);
    doc.text(`Distance: ${distance.toFixed(1)} km`, 20, 110);
    doc.text(`Duration: ${duration.toFixed(0)} minutes`, 20, 120);
    doc.text(`Vehicle: ${ride.vehicle_type || 'Standard'}`, 20, 130);
    if (ride.driver?.name) doc.text(`Driver: ${ride.driver.name}`, 20, 140);
    
    // Total Fare
    doc.setFontSize(16);
    doc.text('Total Fare', 20, 160);
    doc.setFontSize(18);
    doc.text(`৳${totalFare.toFixed(2)}`, 20, 180);
    doc.text('Payment Method: Cash', 20, 220);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing TripNow!', 20, 250);
    
    doc.save(`TripNow_Invoice_${invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black text-gray-900 cursor-pointer" onClick={() => navigate('/')}>TripNow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {ride.rider?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Thank You for Choosing Us!</h1>
          <p className="text-xl text-gray-600">Your ride has been completed successfully</p>
        </div>

        {/* Modern Invoice Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">TripNow Invoice</h2>
                <p className="text-blue-100">Ride Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Invoice #</p>
                <p className="text-2xl font-bold">#{ride.ride_number || ride.id}</p>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-8">
            {/* Trip Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Trip Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-semibold text-gray-900">{ride.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-500">Drop-off Location</p>
                      <p className="font-semibold text-gray-900">{ride.drop_location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Ride Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {ride.completed_at ? new Date(ride.completed_at).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{ride.vehicle_type || 'Standard'}</p>
                  </div>
                  {ride.driver && (
                    <div>
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-semibold text-gray-900">{ride.driver.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Fare */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                Total Fare
              </h3>
              
              <div className="text-center">
                <span className="text-4xl font-bold text-green-600">৳{ride.total_fare ? parseFloat(ride.total_fare).toFixed(2) : '0.00'}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Payment Information
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cash Payment</p>
                    <p className="text-sm text-gray-500">Paid to driver</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">৳{ride.total_fare ? parseFloat(ride.total_fare).toFixed(2) : '0.00'}</span>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{ride.distance ? `${parseFloat(ride.distance).toFixed(1)}` : '0'}</p>
                <p className="text-sm text-blue-700">Kilometers</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{ride.duration ? `${parseFloat(ride.duration).toFixed(0)}` : '0'}</p>
                <p className="text-sm text-green-700">Minutes</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">5.0</p>
                <p className="text-sm text-purple-700">Rating</p>
              </div>
            </div>
          </div>

          {/* Invoice Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Thank you for choosing TripNow!</p>
              <p className="text-sm text-gray-500">For support, contact us at support@tripnow.com</p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Experience</h3>
            <p className="text-gray-600">Help us improve our service</p>
          </div>

          <div className="flex justify-center space-x-3 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transform hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-center bg-yellow-50 rounded-xl p-4">
              <p className="text-yellow-800 font-semibold">
                Thank you for your {rating} star{rating > 1 ? 's' : ''} rating!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => downloadInvoice()}
            className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Download Invoice PDF</span>
          </button>

          <button
            onClick={handleBookAnother}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2"
          >
            <Car className="w-5 h-5" />
            <span>Book Another Ride</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCompletedPage;
