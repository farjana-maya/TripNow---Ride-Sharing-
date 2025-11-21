import { useState, useEffect } from 'react';
import { ArrowLeft, Star, DollarSign, TrendingUp, Award, MapPin, Phone, Mail, Calendar, Car, FileText, Ban, CheckCircle } from 'lucide-react';

export default function DriverProfile() {
  const [driver, setDriver] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = () => {
    setTimeout(() => {
      setDriver({
        id: 1,
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+8801712345678',
          address: 'Gulshan, Dhaka, Bangladesh',
          joined_date: '2024-01-15'
        },
        license_number: 'DL-2024-001234',
        license_expiry: '2026-12-31',
        vehicle_model: 'Toyota Camry',
        vehicle_number: 'DHK-GA-12-3456',
        vehicle_color: 'Silver',
        vehicle_year: 2020,
        vehicle_type: 'car',
        status: 'online',
        is_available: true,
        is_blocked: false,
        rating: 4.8,
        total_rides: 1250,
        completed_rides: 1200,
        cancelled_rides: 50,
        total_earnings: 15650.50,
        wallet_balance: 2340.25,
        pending_earnings: 450.75,
        stats: {
          acceptance_rate: 95.5,
          cancellation_rate: 4.0,
          completion_rate: 96.0,
          avg_rating: 4.8,
          online_hours: 156,
          avg_response_time: 45
        },
        recentRides: [
          { id: 1, rider: 'Sarah Smith', from: 'Gulshan', to: 'Banani', fare: 250, status: 'completed', date: '2025-10-08' },
          { id: 2, rider: 'Mike Johnson', from: 'Dhanmondi', to: 'Uttara', fare: 450, status: 'completed', date: '2025-10-07' },
          { id: 3, rider: 'Emma Wilson', from: 'Mirpur', to: 'Mohakhali', fare: 320, status: 'completed', date: '2025-10-06' }
        ],
        documents: [
          { type: 'Driving License', status: 'approved', verified_at: '2024-01-20' },
          { type: 'Vehicle Registration', status: 'approved', verified_at: '2024-01-20' },
          { type: 'Insurance', status: 'approved', verified_at: '2024-01-20' },
          { type: 'Profile Photo', status: 'approved', verified_at: '2024-01-20' }
        ],
        ratings: [
          { id: 1, rider: 'Sarah Smith', rating: 5, comment: 'Excellent driver!', date: '2025-10-08' },
          { id: 2, rider: 'Mike Johnson', rating: 4, comment: 'Good service', date: '2025-10-07' },
          { id: 3, rider: 'Emma Wilson', rating: 5, comment: 'Very professional', date: '2025-10-06' }
        ]
      });
      setLoading(false);
    }, 500);
  };

  const goBack = () => {
    window.history.back();
  };

  const getStatusBadge = (status) => {
    const colors = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Drivers
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {driver.user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{driver.user.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(driver.status)}
                {driver.is_available && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for rides
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!driver.is_blocked ? (
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                <Ban className="w-4 h-4" />
                Block Driver
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                <CheckCircle className="w-4 h-4" />
                Unblock Driver
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-800">{driver.rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-gray-800">{driver.total_rides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">${typeof driver.total_earnings === 'number' ? driver.total_earnings.toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800">{driver.stats.completion_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {['overview', 'rides', 'earnings', 'ratings', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-800">{driver.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{driver.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-800">{driver.user.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Joined Date</p>
                      <p className="font-medium text-gray-800">{driver.user.joined_date}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Model</p>
                      <p className="font-medium text-gray-800">{driver.vehicle_model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">License Number</p>
                      <p className="font-medium text-gray-800">{driver.license_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Vehicle Number</p>
                      <p className="font-medium text-gray-800">{driver.vehicle_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Color & Year</p>
                      <p className="font-medium text-gray-800">{driver.vehicle_color} - {driver.vehicle_year}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Acceptance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{driver.stats.acceptance_rate}%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Cancellation Rate</p>
                    <p className="text-2xl font-bold text-red-600">{driver.stats.cancellation_rate}%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">{driver.stats.completion_rate}%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Online Hours</p>
                    <p className="text-2xl font-bold text-purple-600">{driver.stats.online_hours}h</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-yellow-600">{driver.stats.avg_response_time}s</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-indigo-600">${driver.wallet_balance}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rides' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Rides</h3>
              <div className="space-y-3">
                {driver.recentRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{ride.rider}</p>
                      <p className="text-sm text-gray-600">{ride.from} → {ride.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${ride.fare}</p>
                      <p className="text-xs text-gray-500">{ride.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">${typeof driver.total_earnings === 'number' ? driver.total_earnings.toFixed(2) : '0.00'}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="text-3xl font-bold text-blue-600">${driver.wallet_balance.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-600">Pending Earnings</p>
                  <p className="text-3xl font-bold text-yellow-600">${driver.pending_earnings.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-gray-600">Earnings chart and detailed breakdown would appear here</p>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {driver.ratings.map((rating) => (
                  <div key={rating.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800">{rating.rider}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{rating.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">{rating.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Verified Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {driver.documents.map((doc, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">{doc.type}</p>
                        <p className="text-sm text-gray-600">Verified on {doc.verified_at}</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}