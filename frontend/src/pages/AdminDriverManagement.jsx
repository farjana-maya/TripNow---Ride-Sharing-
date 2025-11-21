import React, { useState, useEffect } from 'react';
import { 
  Car, CheckCircle, XCircle, Clock, Filter, Search, 
  Eye, UserCheck, UserX, AlertCircle, Star, MapPin,
  Phone, Mail, Calendar, Hash, Palette, FileText
} from 'lucide-react';

const AdminDriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadDrivers();
  }, [activeTab]);

  useEffect(() => {
    filterDrivers();
  }, [searchQuery, drivers]);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const endpoint = activeTab === 'pending' 
        ? 'http://localhost:8000/api/admin/drivers/pending'
        : `http://localhost:8000/api/admin/drivers/all?status=${activeTab}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        // Handle different response structures
        if (activeTab === 'pending') {
          setDrivers(data.drivers || []);
        } else {
          setDrivers(data.data?.data || data.drivers || []);
        }
      }
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    if (!searchQuery) {
      setFilteredDrivers(drivers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = drivers.filter(driver => 
      driver.user?.name?.toLowerCase().includes(query) ||
      driver.user?.email?.toLowerCase().includes(query) ||
      driver.license_number?.toLowerCase().includes(query) ||
      driver.vehicle_number?.toLowerCase().includes(query)
    );
    setFilteredDrivers(filtered);
  };

  const handleApprove = async (driverId) => {
    if (!window.confirm('Are you sure you want to approve this driver?')) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/drivers/${driverId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Driver approved successfully! Notification sent.');
        loadDrivers();
        setShowModal(false);
      } else {
        alert(data.message || 'Failed to approve driver');
      }
    } catch (error) {
      alert('Failed to approve driver');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (driverId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this driver?')) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/drivers/${driverId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Driver rejected. Notification sent.');
        loadDrivers();
        setShowModal(false);
        setRejectionReason('');
      } else {
        alert(data.message || 'Failed to reject driver');
      }
    } catch (error) {
      alert('Failed to reject driver');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    // Dynamic status based on current login state
    const isCurrentlyOnline = status === 'online';

    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      online: 'bg-green-100 text-green-800 border-green-300',
      offline: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    const icons = {
      pending: <Clock size={14} />,
      approved: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />,
      online: <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>,
      offline: <div className="w-2 h-2 bg-gray-400 rounded-full"></div>,
    };

    // For approved tab, show dynamic status
    const displayStatus = status === 'approved' ? 'APPROVED' :
                         status === 'online' ? 'ONLINE' :
                         status === 'offline' ? 'OFFLINE' :
                         status.toUpperCase();

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {icons[status]}
        <span>{displayStatus}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Driver Management</h1>
          <p className="text-gray-400">Manage and verify driver applications</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-800/50 p-2 rounded-2xl backdrop-blur-xl">
          {[
            { key: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
            { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'green' },
            { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' },
            { key: 'online', label: 'Online', icon: MapPin, color: 'blue' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.key
                  ? `bg-${tab.color}-500 text-white shadow-lg`
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, license, or vehicle number..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Drivers List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading drivers...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-12 text-center border border-gray-700">
            <Car className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">No Drivers Found</h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try adjusting your search criteria' : `No ${activeTab} drivers at the moment`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {driver.user?.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-white">{driver.user?.name || 'N/A'}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{driver.user?.email || 'N/A'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{driver.user?.phone || 'N/A'}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Car size={14} />
                          <span>{driver.vehicle_type} - {driver.vehicle_model}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Hash size={14} />
                          <span>{driver.vehicle_number}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getStatusBadge(driver.status)}
                    <button
                      onClick={() => {
                        setSelectedDriver(driver);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all flex items-center space-x-2"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Driver Details Modal */}
        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Driver Details</h2>
                    <p className="text-white/80">Review and manage driver application</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setRejectionReason('');
                    }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-cyan-400" size={18} />
                    </div>
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                      <p className="text-white font-semibold">{selectedDriver.user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Email</label>
                      <p className="text-white font-semibold">{selectedDriver.user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Phone</label>
                      <p className="text-white font-semibold">{selectedDriver.user?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Joined Date</label>
                      <p className="text-white font-semibold">
                        {new Date(selectedDriver.user?.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-400" size={18} />
                    </div>
                    <span>License Information</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">License Number</label>
                      <p className="text-white font-semibold">{selectedDriver.license_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Expiry Date</label>
                      <p className="text-white font-semibold">
                        {selectedDriver.license_expiry 
                          ? new Date(selectedDriver.license_expiry).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Car className="text-emerald-400" size={18} />
                    </div>
                    <span>Vehicle Information</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Vehicle Type</label>
                      <p className="text-white font-semibold capitalize">{selectedDriver.vehicle_type || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Model</label>
                      <p className="text-white font-semibold">{selectedDriver.vehicle_model || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Vehicle Number</label>
                      <p className="text-white font-semibold">{selectedDriver.vehicle_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Color</label>
                      <p className="text-white font-semibold">{selectedDriver.vehicle_color || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Year</label>
                      <p className="text-white font-semibold">{selectedDriver.vehicle_year || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Status</label>
                      {getStatusBadge(selectedDriver.status)}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics (for approved drivers) */}
                {selectedDriver.status === 'approved' && (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Star className="text-yellow-400" size={18} />
                      </div>
                      <span>Performance Metrics</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-white">{selectedDriver.rating || '0.0'}</p>
                        <p className="text-xs text-gray-400 mt-1">Rating</p>
                      </div>
                      <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-white">{selectedDriver.total_rides || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Total Rides</p>
                      </div>
                      <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-white">{selectedDriver.completed_rides || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-gray-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-white">
                          ${typeof selectedDriver.total_earnings === 'number' ? selectedDriver.total_earnings.toFixed(2) : '0.00'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Earnings</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection Reason (if rejected) */}
                {selectedDriver.status === 'rejected' && selectedDriver.rejection_reason && (
                  <div className="bg-red-900/20 rounded-2xl p-6 border-2 border-red-500/50">
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <span>Rejection Reason</span>
                    </h3>
                    <p className="text-white">{selectedDriver.rejection_reason}</p>
                  </div>
                )}

                {/* Actions (for pending drivers) */}
                {selectedDriver.status === 'pending' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-900/20 rounded-2xl p-4 border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm font-semibold flex items-center space-x-2">
                        <AlertCircle size={16} />
                        <span>This driver is pending approval. Review the information and take action.</span>
                      </p>
                    </div>

                    {/* Rejection Reason Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Rejection Reason (required for rejection)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a clear reason if you're rejecting this application..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                        rows="3"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(selectedDriver.id)}
                        disabled={actionLoading}
                        className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={20} />
                        <span>{actionLoading ? 'Processing...' : 'Approve Driver'}</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedDriver.id)}
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <XCircle size={20} />
                        <span>{actionLoading ? 'Processing...' : 'Reject Driver'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDriverManagement;