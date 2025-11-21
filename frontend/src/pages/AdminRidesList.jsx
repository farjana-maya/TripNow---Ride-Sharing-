import React, { useState, useEffect } from 'react';
import { 
  Car, Clock, MapPin, User, DollarSign, Download, 
  Filter, Search, RefreshCw, ChevronDown, Calendar,
  Eye, CheckCircle, XCircle, AlertCircle, Navigation,
  TrendingUp, Package, FileText
} from 'lucide-react';
import ApiService from '../services/apiService';
import ExportService from '../services/ExportService';

const AdminRidesList = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
  
  // View mode
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadRides();
    loadStatistics();
  }, [activeTab, statusFilter, vehicleTypeFilter, paymentStatusFilter, dateFrom, dateTo, currentPage, perPage]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm || searchTerm === '') {
        loadRides();
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const loadRides = async () => {
    try {
      setLoading(true);
      setError('');

      let data;
      
      if (activeTab === 'ongoing') {
        data = await ApiService.getOngoingRides();
        setRides(data.rides || []);
      } else if (activeTab === 'completed') {
        const params = dateFrom || dateTo ? { date_from: dateFrom, date_to: dateTo, per_page: perPage } : { per_page: perPage };
        data = await ApiService.getCompletedRides(params);
        setRides(data.rides.data || data.rides || []);
        setTotalPages(data.rides.last_page || 1);
      } else if (activeTab === 'cancelled') {
        const params = dateFrom || dateTo ? { date_from: dateFrom, date_to: dateTo, per_page: perPage } : { per_page: perPage };
        data = await ApiService.getCancelledRides(params);
        setRides(data.rides.data || data.rides || []);
        setTotalPages(data.rides.last_page || 1);
      } else {
        const params = {
          page: currentPage,
          per_page: perPage,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter && { status: statusFilter }),
          ...(vehicleTypeFilter && { vehicle_type: vehicleTypeFilter }),
          ...(paymentStatusFilter && { payment_status: paymentStatusFilter }),
          ...(dateFrom && { date_from: dateFrom }),
          ...(dateTo && { date_to: dateTo }),
        };
        
        data = await ApiService.getRides(params);
        setRides(data.rides.data || data.rides || []);
        setTotalPages(data.rides.last_page || 1);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
      setError(error.message || 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await ApiService.getRideStatistics();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const data = await ApiService.exportRides(params);
      
      if (data.success && data.data) {
        const success = ExportService.exportToCSV(data.data, data.filename);
        if (success) {
          alert('Export successful!');
        } else {
          alert('Export failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export rides: ' + error.message);
    }
  };

  const handleViewDetails = async (ride) => {
    try {
      const data = await ApiService.getRideDetails(ride.id);
      if (data.success) {
        setSelectedRide(data.ride);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error loading ride details:', error);
      alert('Failed to load ride details');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      assigned: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-purple-100 text-purple-800 border-purple-200',
      arrived: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      started: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      assigned: User,
      accepted: CheckCircle,
      arrived: MapPin,
      started: Car,
      completed: CheckCircle,
      cancelled: XCircle
    };
    return icons[status] || AlertCircle;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return amount ? `৳${parseFloat(amount).toFixed(2)}` : '৳0.00';
  };

  const tabs = [
    { id: 'all', label: 'All Rides', icon: Package },
    { id: 'ongoing', label: 'Ongoing', icon: Navigation },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle }
  ];

  const filterOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'started', label: 'Started' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const vehicleTypes = [
    { value: '', label: 'All Vehicles' },
    { value: 'bike', label: 'Bike' },
    { value: 'standard', label: 'Standard' },
    { value: 'premium', label: 'Premium' },
    { value: 'suv', label: 'SUV' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ride Management</h1>
          <p className="text-gray-400 mt-1">Monitor and manage all rides in the system</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.total_rides}</p>
            <p className="text-sm text-gray-400">Total Rides</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Navigation className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.ongoing_rides}</p>
            <p className="text-sm text-gray-400">Ongoing Rides</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-xs text-gray-400">Success</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stats.completed_rides}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-xs text-gray-400">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.total_revenue)}</p>
            <p className="text-sm text-gray-400">Total Revenue</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-2">
        <div className="flex space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ride number, rider, driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Vehicle Type Filter */}
          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {vehicleTypes.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadRides}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Rides List */}
      {loading ? (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading rides...</p>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
          {rides.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No rides found</h3>
              <p className="text-gray-400">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ride Details</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Rider</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Fare</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {rides.map((ride) => {
                      const StatusIcon = getStatusIcon(ride.status);
                      return (
                        <tr key={ride.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-semibold">#{ride.ride_number}</p>
                              <p className="text-gray-400 text-sm">{formatDate(ride.created_at)}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                  {ride.vehicle_type}
                                </span>
                                {ride.distance && (
                                  <span className="text-xs text-gray-400">
                                    {ride.distance} km
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                {ride.rider?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">{ride.rider?.name}</p>
                                <p className="text-gray-400 text-sm">{ride.rider?.phone || ride.rider?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {ride.driver ? (
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                  {ride.driver.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{ride.driver.name}</p>
                                  <p className="text-gray-400 text-sm">{ride.driver.phone || ride.driver.email}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">Not assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-start space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-300 text-sm line-clamp-1">{ride.pickup_location}</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-sm mt-1 flex-shrink-0"></div>
                                <p className="text-gray-300 text-sm line-clamp-1">{ride.drop_location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ride.status)}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                            </span>
                            {ride.payment_status && (
                              <p className="text-xs text-gray-400 mt-1">
                                Payment: {ride.payment_status}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-semibold">
                                {ride.total_fare ? formatCurrency(ride.total_fare) : 'Pending'}
                              </p>
                              {ride.payment_method && (
                                <p className="text-xs text-gray-400 mt-1 capitalize">
                                  {ride.payment_method}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(ride)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Ride Details Modal */}
      {showDetailsModal && selectedRide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 z-10">
              <h2 className="text-2xl font-bold text-white">Ride Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Ride Number</p>
                  <p className="text-white font-semibold">#{selectedRide.ride_number}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedRide.status)}`}>
                    {selectedRide.status.charAt(0).toUpperCase() + selectedRide.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Vehicle Type</p>
                  <p className="text-white capitalize">{selectedRide.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Created At</p>
                  <p className="text-white">{formatDate(selectedRide.created_at)}</p>
                </div>
              </div>

              {/* Rider & Driver Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Rider Information</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">{selectedRide.rider?.name}</p>
                    <p className="text-gray-400 text-sm">{selectedRide.rider?.email}</p>
                    <p className="text-gray-400 text-sm">{selectedRide.rider?.phone}</p>
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">Driver Information</h3>
                  {selectedRide.driver ? (
                    <div className="space-y-2">
                      <p className="text-gray-300">{selectedRide.driver.name}</p>
                      <p className="text-gray-400 text-sm">{selectedRide.driver.email}</p>
                      <p className="text-gray-400 text-sm">{selectedRide.driver.phone}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Not assigned</p>
                  )}
                </div>
              </div>

              {/* Route Info */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Route Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Pickup Location</p>
                      <p className="text-white">{selectedRide.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white"></div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Drop-off Location</p>
                      <p className="text-white">{selectedRide.drop_location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">Fare Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance</span>
                    <span className="text-white">{selectedRide.distance || 'N/A'} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{selectedRide.duration || 'N/A'} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Fare</span>
                    <span className="text-white">{formatCurrency(selectedRide.base_fare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance Fare</span>
                    <span className="text-white">{formatCurrency(selectedRide.distance_fare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Fare</span>
                    <span className="text-white">{formatCurrency(selectedRide.time_fare)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total Fare</span>
                      <span className="text-green-400">{formatCurrency(selectedRide.total_fare)}</span>
                    </div>
                  </div>
                  {selectedRide.payment_method && (
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="text-white capitalize">{selectedRide.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedRide.notes && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">Notes</h3>
                  <p className="text-gray-300">{selectedRide.notes}</p>
                </div>
              )}

              {/* Cancellation Info */}
              {selectedRide.status === 'cancelled' && selectedRide.cancellation_reason && (
                <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
                  <h3 className="text-red-400 font-semibold mb-2">Cancellation Details</h3>
                  <p className="text-gray-300 mb-2">{selectedRide.cancellation_reason}</p>
                  {selectedRide.cancelled_by && (
                    <p className="text-gray-400 text-sm">Cancelled by: {selectedRide.cancelled_by}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRidesList;