import { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    productService.getPending().then(setPendingProducts).catch(() => {});
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const data = await productService.getAll();
        setProducts(data);
      } else if (activeTab === 'pendingProducts') {
        const data = await productService.getPending();
        setPendingProducts(data);
      } else if (activeTab === 'orders') {
        const data = await orderService.getAll();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productService.create(productForm);
      setShowModal(false);
      resetForm();
      fetchData();
      alert('Product created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productService.update(editingProduct.id, productForm);
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
      alert('Product updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await productService.delete(id);
      fetchData();
      alert('Product deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      fetchData();
      alert('Đã cập nhật trạng thái đơn hàng!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      await productService.approve(id);
      fetchData();
      alert('Đã duyệt sản phẩm!');
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: product.image || '',
      category: product.category || '',
      stock: product.stock,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: '',
    });
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Trang quản trị</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Quản lý sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('pendingProducts')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === 'pendingProducts'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Duyệt sản phẩm
          {pendingProducts.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
              {pendingProducts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Duyệt đơn hàng
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Quản lý sản phẩm</h2>
            <button
              onClick={() => {
                resetForm();
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="btn-primary"
            >
              + Thêm sản phẩm
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://via.placeholder.com/50'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">${product.price?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' : 
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-primary-600 hover:text-primary-700 font-medium mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Products Tab - Duyệt sản phẩm */}
      {activeTab === 'pendingProducts' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sản phẩm chờ duyệt ({pendingProducts.length})</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : pendingProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Không có sản phẩm nào chờ duyệt.
            </div>
          ) : (
            <div className="grid gap-4 card-grid-animate">
              {pendingProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center gap-6"
                  style={{ '--card-index': index }}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category} • ${product.price?.toLocaleString()}</p>
                    {product.creator_name && (
                      <p className="text-xs text-gray-400 mt-1">Người gửi: {product.creator_name} ({product.creator_email})</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProduct(product.id)}
                      className="btn-primary"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab - Duyệt đơn hàng */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Duyệt đơn hàng</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4 card-grid-animate">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm p-6"
                  style={{ '--card-index': index }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-gray-800">Đơn #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.user_name || 'User'} - {order.user_email}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'pending' ? 'Chờ duyệt' : order.status}
                      </span>
                      <span className="font-bold text-primary-600">${order.total_price?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        className="btn-primary"
                      >
                        Duyệt đơn
                      </button>
                    )}
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="input-field w-auto"
                    >
                      <option value="pending">Chờ duyệt</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đã giao vận</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                  {loading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
