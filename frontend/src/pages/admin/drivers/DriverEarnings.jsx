import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Wallet, Clock, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';

export default function DriverEarnings() {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPayoutRequests();
  }, [filterStatus]);

  const fetchPayoutRequests = () => {
    // Simulated data
    setStats({
      pending: 5,
      approved: 12,
      processed: 45,
      total_pending_amount: 15450.50
    });

    setPayoutRequests([
      {
        id: 1,
        payout_number: 'PAY-001234',
        driver: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+8801712345678'
        },
        amount: 2500.00,
        payment_method: 'Bank Transfer',
        account_details: 'Bank: DBBL, Account: ****5678',
        status: 'pending',
        created_at: '2025-10-08T10:30:00Z',
        wallet_balance: 3200.00
      },
      {
        id: 2,
        payout_number: 'PAY-001235',
        driver: {
          name: 'Sarah Smith',
          email: 'sarah@example.com',
          phone: '+8801812345679'
        },
        amount: 3200.00,
        payment_method: 'bKash',
        account_details: 'bKash: +880171****789',
        status: 'pending',
        created_at: '2025-10-07T14:20:00Z',
        wallet_balance: 4500.00
      },
      {
        id: 3,
        payout_number: 'PAY-001230',
        driver: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+8801912345680'
        },
        amount: 1800.00,
        payment_method: 'Nagad',
        account_details: 'Nagad: +880181****456',
        status: 'approved',
        created_at: '2025-10-06T09:15:00Z',
        approved_at: '2025-10-07T10:00:00Z',
        wallet_balance: 2100.00
      },
      {
        id: 4,
        payout_number: 'PAY-001228',
        driver: {
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+8801612345681'
        },
        amount: 2200.00,
        payment_method: 'Bank Transfer',
        account_details: 'Bank: City Bank, Account: ****1234',
        status: 'processed',
        created_at: '2025-10-05T11:30:00Z',
        approved_at: '2025-10-06T09:00:00Z',
        processed_at: '2025-10-06T15:30:00Z',
        transaction_reference: 'TXN-2025-001234',
        wallet_balance: 3800.00
      }
    ]);
  };

  const openActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowModal(true);
    setRejectReason('');
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Payout ${selectedRequest.payout_number} approved successfully!`);
      fetchPayoutRequests();
      setShowModal(false);
    } catch (error) {
      alert('Error approving payout');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Payout ${selectedRequest.payout_number} rejected`);
      fetchPayoutRequests();
      setShowModal(false);
    } catch (error) {
      alert('Error rejecting payout');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Payout ${selectedRequest.payout_number} marked as processed!`);
      fetchPayoutRequests();
      setShowModal(false);
    } catch (error) {
      alert('Error processing payout');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      processed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  const filteredRequests = filterStatus === 'all' 
    ? payoutRequests 
    : payoutRequests.filter(req => req.status === filterStatus);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Driver Earnings & Payouts</h1>
        <p className="text-gray-600 mt-1">Manage driver payout requests and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800">{stats.approved || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.processed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-800">${stats.total_pending_amount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'approved', 'processed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {request.driver.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-800">{request.driver.name}</h3>
                    {getStatusBadge(request.status)}
                    <span className="text-sm text-gray-500">#{request.payout_number}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600 text-lg">${request.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-800">{request.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Details</p>
                      <p className="font-medium text-gray-800">{request.account_details}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Wallet Balance</p>
                      <p className="font-medium text-blue-600">${request.wallet_balance.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>Requested: {formatDate(request.created_at)}</p>
                    {request.approved_at && (
                      <p>Approved: {formatDate(request.approved_at)}</p>
                    )}
                    {request.processed_at && (
                      <p>Processed: {formatDate(request.processed_at)} | Ref: {request.transaction_reference}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => openActionModal(request, 'approve')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => openActionModal(request, 'reject')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {request.status === 'approved' && (
                  <button
                    onClick={() => openActionModal(request, 'process')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Mark as Processed
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === 'approve' && 'Approve Payout'}
              {actionType === 'reject' && 'Reject Payout'}
              {actionType === 'process' && 'Process Payout'}
            </h3>
            
            <div className="mb-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver:</span>
                    <span className="font-semibold">{selectedRequest.driver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-green-600">${selectedRequest.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-semibold">{selectedRequest.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-semibold">{selectedRequest.account_details}</span>
                  </div>
                </div>
              </div>

              {actionType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder="Provide a clear reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'approve' ? handleApprove : actionType === 'reject' ? handleReject : handleProcess}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg transition disabled:opacity-50 font-medium text-white ${
                  actionType === 'approve' || actionType === 'process' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
