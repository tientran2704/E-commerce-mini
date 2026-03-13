import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((__, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <Link to="/" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6 card-grid-animate">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              style={{ '--card-index': index }}
            >
              <div className="p-6 border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-primary-600">${order.total_price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn-secondary"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-6 bg-gray-50">
                <p className="text-sm text-gray-500 mb-3">{order.items?.length || 0} items</p>
                <div className="flex flex-wrap gap-3">
                  {order.items?.slice(0, 4).map((item, index) => (
                    <div key={index} className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={item.product_image || 'https://via.placeholder.com/100'}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-sm text-gray-500">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
