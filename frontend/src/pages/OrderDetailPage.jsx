import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="btn-primary inline-block mt-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {order.shipping_address || 'Not provided'}
            </p>
          </div>

          {/* Payment Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
            <p className="text-gray-600 capitalize">
              {order.payment_method?.replace('_', ' ') || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                  <img
                    src={item.product_image || 'https://via.placeholder.com/100'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ${((item.price || 0) * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">
                    ${item.price?.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-primary-600">${order.total_price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
