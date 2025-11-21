import { useState, useEffect } from 'react';
import { Ban, Unlock, AlertTriangle, Clock, User, Calendar } from 'lucide-react';

export default function BlockedDrivers() {
  const [blockedDrivers, setBlockedDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlockedDrivers();
  }, []);

  const fetchBlockedDrivers = () => {
    // Simulated data
    setBlockedDrivers([
      {
        id: 1,
        user: {
          name: 'Robert Johnson',
          email: 'robert@example.com',
          phone: '+8801712345678'
        },
        vehicle_model: 'Honda Civic',
        vehicle_number: 'DHK-BA-12-3456',
        block_reason: 'Multiple customer complaints about rude behavior',
        block_type: 'temporary',
        blocked_at: '2025-10-01T10:30:00Z',
        block_until: '2025-10-15T23:59:59Z',
        blocked_by_name: 'Admin User',
        total_rides: 450,
        rating: 3.2
      },
      {
        id: 2,
        user: {
          name: 'Michael Brown',
          email: 'michael@example.com',
          phone: '+8801812345679'
        },
        vehicle_model: 'Toyota Corolla',
        vehicle_number: 'DHK-CA-45-6789',
        block_reason: 'Safety violation - driving under influence',
        block_type: 'permanent',
        blocked_at: '2025-09-15T14:20:00Z',
        block_until: null,
        blocked_by_name: 'Admin User',
        total_rides: 890,
        rating: 4.1
      },
      {
        id: 3,
        user: {
          name: 'James Wilson',
          email: 'james@example.com',
          phone: '+8801912345680'
        },
        vehicle_model: 'Suzuki Swift',
        vehicle_number: 'DHK-DA-78-9012',
        block_reason: 'Repeated ride cancellations without valid reason',
        block_type: 'temporary',
        blocked_at: '2025-10-05T08:15:00Z',
        block_until: '2025-10-12T23:59:59Z',
        blocked_by_name: 'Admin User',
        total_rides: 234,
        rating: 3.8
      }
    ]);
  };

  const openUnblockModal = (driver) => {
    setSelectedDriver(driver);
    setShowUnblockModal(true);
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Driver ${selectedDriver.user.name} has been unblocked successfully!`);
      setBlockedDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
      setShowUnblockModal(false);
    } catch (error) {
      alert('Error unblocking driver');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (blockUntil) => {
    if (!blockUntil) return null;
    const days = Math.ceil((new Date(blockUntil) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getBlockTypeBadge = (type) => {
    return type === 'permanent' ? (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1">
        <Ban className="w-3 h-3" />
        Permanent
      </span>
    ) : (
      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Temporary
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blocked Drivers</h1>
        <p className="text-gray-600 mt-1">Manage drivers who have been blocked from the platform</p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              {blockedDrivers.length} blocked driver{blockedDrivers.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Review blocked drivers and unblock when appropriate
            </p>
          </div>
        </div>
      </div>

      {blockedDrivers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Ban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Blocked Drivers</h3>
          <p className="text-gray-500">All drivers are currently active on the platform</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blockedDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {driver.user.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{driver.user.name}</h3>
                        {getBlockTypeBadge(driver.block_type)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{driver.user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{driver.vehicle_model} - {driver.vehicle_number}</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">Block Reason:</p>
                            <p className="text-sm text-red-700 mt-1">{driver.block_reason}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-600">Blocked On</p>
                          <p className="font-medium text-gray-800">{formatDate(driver.blocked_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Blocked By</p>
                          <p className="font-medium text-gray-800">{driver.blocked_by_name}</p>
                        </div>
                        {driver.block_type === 'temporary' && driver.block_until && (
                          <>
                            <div>
                              <p className="text-gray-600">Block Until</p>
                              <p className="font-medium text-gray-800">{formatDate(driver.block_until)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Days Remaining</p>
                              <p className="font-medium text-orange-600">{getDaysRemaining(driver.block_until)} days</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600">Total Rides</p>
                          <p className="text-sm font-semibold text-gray-800">{driver.total_rides}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-sm font-semibold text-gray-800">{driver.rating.toFixed(1)} ⭐</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openUnblockModal(driver)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium whitespace-nowrap"
                  >
                    <Unlock className="w-5 h-5" />
                    Unblock Driver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUnblockModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Unlock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Unblock Driver</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to unblock <strong>{selectedDriver.user.name}</strong>?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Block Reason:</p>
                    <p className="text-sm text-yellow-700 mt-1">{selectedDriver.block_reason}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>✓ Driver will be able to go online immediately</p>
                <p>✓ Driver can start accepting ride requests</p>
                <p>✓ All restrictions will be removed from their account</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnblockModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUnblock}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Unblocking...' : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}