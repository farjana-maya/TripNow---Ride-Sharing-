import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Car, User, CheckCircle, XCircle, AlertCircle, Search, Filter, RefreshCw, Download, Eye, Edit, Trash2 } from 'lucide-react';
import ApiService from '../services/apiService';
import ExportService from '../services/ExportService';

const AdminRideManagement = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedRides, setSelectedRides] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRideForStatus, setSelectedRideForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideModal, setShowRideModal] = useState(false);

  useEffect(() => {
    loadRides();
    loadStats();
  }, [filter]);

  const loadRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`http://localhost:8000/api/admin/rides?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRides(data.rides.data);
      } else {
        setError(data.message || 'Failed to load rides');
      }
    } catch (error) {
      console.error('Error loading rides:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/admin/rides/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const assignDriver = async (rideId, driverId) => {
    try {
      const data = await ApiService.assignDriver(rideId, driverId);
      if (data.success) {
        loadRides(); // Refresh the list
        alert('Driver assigned successfully!');
      } else {
        alert(data.message || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Network error');
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (searchTerm) params.search = searchTerm;

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

  const updateRideStatus = async (rideId, status, reason = null) => {
    try {
      const data = await ApiService.updateRideStatus(rideId, status, reason);
      if (data.success) {
        loadRides();
        setShowStatusModal(false);
        setSelectedRideForStatus(null);
        setNewStatus('');
        setStatusReason('');
        alert('Ride status updated successfully!');
      } else {
        alert(data.message || 'Failed to update ride status');
      }
    } catch (error) {
      console.error('Error updating ride status:', error);
      alert('Network error');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedRides.length === 0) {
      alert('Please select rides to update');
      return;
    }

    const reason = status === 'cancelled' ? prompt('Enter cancellation reason:') : null;
    if (status === 'cancelled' && !reason) return;

    try {
      const data = await ApiService.bulkUpdateRideStatus(selectedRides, status, reason);
      if (data.success) {
        alert(`Successfully updated ${data.updated_count} rides`);
        loadRides(); // Refresh the list
        setSelectedRides([]);
        setShowBulkActions(false);
      } else {
        alert(data.message || 'Failed to bulk update rides');
      }
    } catch (error) {
      console.error('Error in bulk update:', error);
      alert('Network error during bulk update');
    }
  };

  const handleSelectRide = (rideId) => {
    setSelectedRides(prev =>
      prev.includes(rideId)
        ? prev.filter(id => id !== rideId)
        : [...prev, rideId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRides.length === filteredRides.length) {
      setSelectedRides([]);
    } else {
      setSelectedRides(filteredRides.map(ride => ride.id));
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterOptions = [
    { value: 'all', label: 'All Rides' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'started', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredRides = rides.filter(ride =>
    ride.ride_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.rider?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.driver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ride Management</h1>
        <p className="text-gray-400">Monitor and manage all rides in the system</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rides</p>
                <p className="text-2xl font-bold text-white">{stats.total_rides}</p>
              </div>
              <Car className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending_rides}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.ongoing_rides}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-purple-400">৳{stats.total_revenue}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Today: ৳{stats.today_revenue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-700">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            {selectedRides.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{selectedRides.length} selected</span>
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  Bulk Actions
                </button>
              </div>
            )}

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            <button
              onClick={loadRides}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Panel */}
        {showBulkActions && selectedRides.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Bulk Actions for {selectedRides.length} rides:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('cancelled')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  Cancel Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => setShowBulkActions(false)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Rides Table */}
      {loading ? (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading rides...</p>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden">
          {filteredRides.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No rides found</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'No rides in the system yet.' : `No ${filter} rides found.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRides.length === filteredRides.length && filteredRides.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Ride</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Rider</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Fare</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredRides.map((ride) => {
                    const StatusIcon = getStatusIcon(ride.status);
                    return (
                      <tr key={ride.id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedRides.includes(ride.id)}
                            onChange={() => handleSelectRide(ride.id)}
                            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            onClick={() => { setSelectedRide(ride); setShowRideModal(true); }}
                            className="cursor-pointer hover:bg-gray-600/30 p-2 rounded transition-colors"
                          >
                            <p className="text-white font-semibold">#{ride.ride_number}</p>
                            <p className="text-gray-400 text-sm">{formatDate(ride.created_at)}</p>
                            <p className="text-xs text-cyan-400 mt-1">Click for details</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                              {ride.rider?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{ride.rider?.name}</p>
                              <p className="text-gray-400 text-sm">{ride.rider?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {ride.driver ? (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                                {ride.driver.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-medium">{ride.driver.name}</p>
                                <p className="text-gray-400 text-sm">{ride.driver.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ride.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-semibold">
                            {ride.total_fare ? `৳${ride.total_fare}` : 'Pending'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => { setSelectedRide(ride); setShowRideModal(true); }}
                              className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                            {ride.status === 'pending' && (
                              <button
                                onClick={() => {
                                  const driverId = prompt('Enter driver ID to assign:');
                                  if (driverId) assignDriver(ride.id, driverId);
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Assign Driver
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Ride Details Modal */}
      {showRideModal && selectedRide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Ride Details #{selectedRide.ride_number}</h2>
                <button
                  onClick={() => setShowRideModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedRide.status)}`}>
                    {selectedRide.status?.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">Status</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">৳{selectedRide.total_fare || 0}</p>
                  <p className="text-xs text-gray-400">Total Fare</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-lg font-bold text-cyan-400">{selectedRide.distance || 0} km</p>
                  <p className="text-xs text-gray-400">Distance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Rider Information */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Rider Information</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{selectedRide.rider?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{selectedRide.rider?.name}</p>
                      <p className="text-gray-400">{selectedRide.rider?.email}</p>
                      <p className="text-gray-400">{selectedRide.rider?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Information */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Driver Information</h3>
                  {selectedRide.driver ? (
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{selectedRide.driver?.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{selectedRide.driver?.name}</p>
                        <p className="text-gray-400">{selectedRide.driver?.email}</p>
                        <p className="text-gray-400">{selectedRide.driver?.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No driver assigned</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Route Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-green-400 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm text-gray-400">Pickup Location</p>
                      <p className="text-white font-semibold">{selectedRide.pickup_location || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-red-400 rounded-full mt-1"></div>
                    <div>
                      <p className="text-sm text-gray-400">Drop-off Location</p>
                      <p className="text-white font-semibold">{selectedRide.drop_location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Ride Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-cyan-400" size={16} />
                    <div>
                      <p className="text-sm text-gray-400">Booked At</p>
                      <p className="text-white">{new Date(selectedRide.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedRide.scheduled_at && (
                    <div className="flex items-center space-x-3">
                      <Clock className="text-yellow-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">Scheduled For</p>
                        <p className="text-white">{new Date(selectedRide.scheduled_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedRide.completed_at && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-green-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-400">Completed At</p>
                        <p className="text-white">{new Date(selectedRide.completed_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRideManagement;
