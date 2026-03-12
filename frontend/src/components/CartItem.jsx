const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={item.image || item.product_image || 'https://via.placeholder.com/100'}
          alt={item.name || item.product_name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">
          {item.name || item.product_name}
        </h3>
        <p className="text-primary-600 font-bold">
          ${(item.price || item.product?.price)?.toLocaleString()}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id || item.product_id, (item.quantity || 1) - 1)}
          disabled={(item.quantity || 1) <= 1}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
        <button
          onClick={() => onUpdateQuantity(item.id || item.product_id, (item.quantity || 1) + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          +
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-gray-800">
          ${((item.price || item.product?.price) * (item.quantity || 1)).toLocaleString()}
        </p>
        <button
          onClick={() => onRemove(item.id || item.product_id)}
          className="text-red-500 text-sm hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
