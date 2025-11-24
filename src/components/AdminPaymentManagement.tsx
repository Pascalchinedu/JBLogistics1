import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, orderBy, Timestamp, where } from 'firebase/firestore';
import { db, Payment } from '../lib/firebase';
import { CreditCard, CheckCircle, Clock, RefreshCw } from 'lucide-react';

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'transfer_pending' | 'transfer_confirmed' | 'cod' | 'declined'>('all');

  const loadPayments = async () => {
    try {
      setLoading(true);
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const paymentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];
      
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      setConfirmingPaymentId(paymentId);
      const payment = payments.find(p => p.id === paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Update payment status
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status: 'received',
        confirmedAt: Timestamp.now(),
        confirmedBy: 'admin'
      });
      
      // Also update the corresponding shipment's paymentStatus
      if (payment.trackingId) {
        const shipmentsRef = collection(db, 'shipments');
        const shipmentQuery = query(shipmentsRef, where('trackingNumber', '==', payment.trackingId));
        const shipmentSnapshot = await getDocs(shipmentQuery);
        
        if (!shipmentSnapshot.empty) {
          const shipmentDoc = shipmentSnapshot.docs[0];
          await updateDoc(doc(db, 'shipments', shipmentDoc.id), {
            paymentStatus: 'paid',
            updatedAt: Timestamp.now()
          });
          console.log('Shipment paymentStatus updated to "paid" for tracking:', payment.trackingId);
        }
      }
      
      // Update local state
      setPayments(payments.map(p => 
        p.id === paymentId 
          ? { ...p, status: 'received' as const, confirmedAt: Timestamp.now() }
          : p
      ));
      
      // Show success notification
      alert('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const handleDeclinePayment = async (paymentId: string) => {
    const confirmDecline = window.confirm('Are you sure you want to decline this payment? This action cannot be undone.');
    
    if (!confirmDecline) return;
    
    try {
      setConfirmingPaymentId(paymentId);
      const paymentRef = doc(db, 'payments', paymentId);
      
      // Update payment status to declined
      await updateDoc(paymentRef, {
        status: 'declined',
        declinedAt: Timestamp.now(),
        declinedBy: 'admin'
      });
      
      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'declined' as const, declinedAt: Timestamp.now() }
          : payment
      ));
      
      // Show success notification
      alert('Payment declined successfully.');
    } catch (error) {
      console.error('Error declining payment:', error);
      alert('Failed to decline payment. Please try again.');
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pickup_transfer':
        return 'Bank Transfer';
      case 'dropoff_cod':
        return 'Cash on Delivery';
      case 'bank_transfer':
        return 'Bank Transfer';
      default:
        return method || 'N/A';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
      case 'pending':
      case 'cod_pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'received':
      case 'paid':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Received
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const filterPayments = (payments: Payment[]) => {
    if (statusFilter === 'all') return payments;
    
    if (statusFilter === 'transfer_pending') {
      return payments.filter(p => 
        (p.paymentMethod === 'pickup_transfer' || p.paymentMethod === 'bank_transfer' || !p.paymentMethod) && 
        (p.status === 'processing' || p.status === 'pending')
      );
    }
    
    if (statusFilter === 'transfer_confirmed') {
      return payments.filter(p => 
        (p.paymentMethod === 'pickup_transfer' || p.paymentMethod === 'bank_transfer' || !p.paymentMethod) && 
        (p.status === 'received' || p.status === 'paid')
      );
    }
    
    if (statusFilter === 'cod') {
      return payments.filter(p => 
        p.paymentMethod === 'dropoff_cod' || 
        p.paymentMethod === 'cod' || 
        p.status === 'cod_pending'
      );
    }
    
    if (statusFilter === 'declined') {
      return payments.filter(p => p.status === 'declined');
    }
    
    return payments;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
            <p className="text-sm text-gray-600">Manage and confirm customer payments</p>
          </div>
        </div>
        <button
          onClick={loadPayments}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Filter by payment:</span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({payments.length})
            </button>
            <button
              onClick={() => setStatusFilter('transfer_pending')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'transfer_pending'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="md:hidden">⏳ Pending</span>
              <span className="hidden md:inline">Transfer - Pending ({filterPayments(payments).filter(p => statusFilter !== 'transfer_pending').filter(p => (p.paymentMethod === 'pickup_transfer' || p.paymentMethod === 'bank_transfer' || !p.paymentMethod) && (p.status === 'processing' || p.status === 'pending')).length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('transfer_confirmed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'transfer_confirmed'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="md:hidden">✓ Confirmed</span>
              <span className="hidden md:inline">Transfer - Confirmed ({payments.filter(p => (p.paymentMethod === 'pickup_transfer' || p.paymentMethod === 'bank_transfer' || !p.paymentMethod) && (p.status === 'received' || p.status === 'paid')).length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('cod')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'cod'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="md:hidden">💵 COD</span>
              <span className="hidden md:inline">Cash on Delivery ({payments.filter(p => p.paymentMethod === 'dropoff_cod' || p.paymentMethod === 'cod' || p.status === 'cod_pending').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('declined')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'declined'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="md:hidden">✕ Declined</span>
              <span className="hidden md:inline">Declined ({payments.filter(p => p.status === 'declined').length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {filterPayments(payments).length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filterPayments(payments).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.paymentReference || payment.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {payment.trackingId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customerName}
                      </div>
                      <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </div>
                      {(payment.paymentMethod === 'dropoff_cod' || payment.paymentMethod === 'cod' || payment.status === 'cod_pending') && (
                        <div className="text-xs text-orange-600 font-semibold mt-1">
                          Collect ₦{payment.amount.toLocaleString()} from receiver
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div>{getStatusBadge(payment.status)}</div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleConfirmPayment(payment.id)}
                            disabled={confirmingPaymentId === payment.id}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {confirmingPaymentId === payment.id ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                Confirming...
                              </span>
                            ) : (
                              'Confirm'
                            )}
                          </button>
                          <button
                            onClick={() => handleDeclinePayment(payment.id)}
                            disabled={confirmingPaymentId === payment.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-blue-900">Payment Management Tips</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• <strong>Bank Transfer:</strong> Verify payment reference with customer before confirming</p>
              <p>• <strong>Cash on Delivery:</strong> Collect payment from receiver upon package delivery</p>
              <p>• Processing status means payment is awaiting confirmation</p>
              <p>• Once confirmed, payment status updates to "Received" in user's dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentManagement;
