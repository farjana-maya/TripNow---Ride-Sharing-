import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Eye, Calendar, User, Car, AlertCircle } from 'lucide-react';

export default function PendingApprovals() {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const fetchPendingDrivers = () => {
    // Simulated data
    setPendingDrivers([
      {
        id: 1,
        user: {
          name: 'Alex Kumar',
          email: 'alex@example.com',
          phone: '+8801712345678',
          address: 'Dhaka, Bangladesh'
        },
        license_number: 'DL-2024-001234',
        license_expiry: '2026-12-31',
        vehicle_type: 'car',
        vehicle_model: 'Toyota Axio',
        vehicle_number: 'DHK-GA-12-3456',
        vehicle_color: 'Silver',
        vehicle_year: 2020,
        documents: [
          { id: 1, type: 'License', status: 'pending', path: '/docs/license1.pdf' },
          { id: 2, type: 'Vehicle Registration', status: 'pending', path: '/docs/reg1.pdf' },
          { id: 3, type: 'Insurance', status: 'pending', path: '/docs/ins1.pdf' },
          { id: 4, type: 'Profile Photo', status: 'pending', path: '/docs/photo1.jpg' }
        ],
        created_at: '2025-10-05T10:30:00Z'
      },
      {
        id: 2,
        user: {
          name: 'Rashid Ahmed',
          email: 'rashid@example.com',
          phone: '+8801812345679',
          address: 'Chittagong, Bangladesh'
        },
        license_number: 'DL-2024-005678',
        license_expiry: '2027-06-15',
        vehicle_type: 'bike',
        vehicle_model: 'Honda CBR',
        vehicle_number: 'CHT-BA-45-6789',
        vehicle_color: 'Red',
        vehicle_year: 2022,
        documents: [
          { id: 5, type: 'License', status: 'pending', path: '/docs/license2.pdf' },
          { id: 6, type: 'Vehicle Registration', status: 'pending', path: '/docs/reg2.pdf' },
          { id: 7, type: 'Insurance', status: 'pending', path: '/docs/ins2.pdf' }
        ],
        created_at: '2025-10-06T14:20:00Z'
      }
    ]);
  };

  const openApprovalModal = (driver, type) => {
    setSelectedDriver(driver);
    setActionType(type);
    setShowModal(true);
    setReason('');
    setComment('');
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Driver ${selectedDriver.user.name} approved successfully!`);
      setPendingDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
      setShowModal(false);
    } catch (error) {
      alert('Error approving driver');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Driver ${selectedDriver.user.name} rejected`);
      setPendingDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
      setShowModal(false);
    } catch (error) {
      alert('Error rejecting driver');
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = (docPath) => {
    window.open(docPath, '_blank');
  };

  const getDocumentIcon = (type) => {
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysWaiting = (createdAt) => {
    const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Driver Approvals</h1>
        <p className="text-gray-600 mt-1">Review and verify driver applications</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              {pendingDrivers.length} driver{pendingDrivers.length !== 1 ? 's' : ''} waiting for approval
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Please review documents carefully before approving
            </p>
          </div>
        </div>
      </div>

      {pendingDrivers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">All Caught Up!</h3>
          <p className="text-gray-500">No pending driver approvals at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                      {driver.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{driver.user.name}</h3>
                      <p className="text-sm opacity-90">{driver.user.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-90">Waiting</div>
                    <div className="font-semibold">{getDaysWaiting(driver.created_at)} days</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm font-medium text-gray-800">{driver.user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">License Expiry</div>
                      <div className="text-sm font-medium text-gray-800">{formatDate(driver.license_expiry)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Car className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Vehicle</div>
                      <div className="text-sm font-medium text-gray-800">{driver.vehicle_model}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Vehicle Number</div>
                      <div className="text-sm font-medium text-gray-800">{driver.vehicle_number}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Documents ({driver.documents.length})</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {driver.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => viewDocument(doc.path)}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-left"
                      >
                        {getDocumentIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-700 truncate">{doc.type}</div>
                          <div className="text-xs text-gray-500">Click to view</div>
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openApprovalModal(driver, 'approve')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => openApprovalModal(driver, 'reject')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === 'approve' ? 'Approve Driver' : 'Reject Driver'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                You are about to <span className={actionType === 'approve' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {actionType}
                </span> <strong>{selectedDriver.user.name}</strong>
              </p>
            </div>

            {actionType === 'approve' ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add any comments or instructions for the driver..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder="Provide a clear reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'approve' ? handleApprove : handleReject}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg transition disabled:opacity-50 font-medium text-white ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processing...' : actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}