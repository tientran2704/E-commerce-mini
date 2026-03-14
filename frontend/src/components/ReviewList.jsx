import { useState, useEffect } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`text-2xl transition-colors ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    setLoading(true);
    try {
      await reviewService.create({
        product_id: productId,
        rating,
        comment,
      });
      setSuccess('Đánh giá của bạn đã được gửi thành công!');
      setRating(0);
      setComment('');
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">Vui lòng đăng nhập để đánh giá sản phẩm</p>
        <a href="/login" className="text-primary-600 hover:underline font-medium">
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Viết đánh giá của bạn</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Đánh giá của bạn:</label>
        <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nhận xét (không bắt buộc):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          rows="3"
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
};

const ReviewItem = ({ review, currentUserId, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await reviewService.delete(review.id);
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const isOwnReview = currentUserId === review.user_id;

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{review.user_name}</span>
            <StarRating rating={review.rating} />
          </div>
          <span className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString('vi-VN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        {isOwnReview && (
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Xóa đánh giá"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {review.comment && (
        <p className="text-gray-600 mt-2">{review.comment}</p>
      )}

      {showConfirmDelete && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-600">Xác nhận xóa?</span>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Xóa
          </button>
          <button
            onClick={() => setShowConfirmDelete(false)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

const ReviewList = ({ productId, refreshKey }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({ average_rating: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const [reviewsData, ratingData] = await Promise.all([
        reviewService.getByProduct(productId),
        reviewService.getAverageRating(productId),
      ]);
      setReviews(reviewsData);
      setRatingInfo(ratingData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshKey]);

  const renderStars = (rating) => {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
        {ratingInfo.total_reviews > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary-600">{ratingInfo.average_rating}</span>
            <div>
              <div className="text-yellow-400 text-xl">{renderStars(ratingInfo.average_rating)}</div>
              <span className="text-sm text-gray-500">{ratingInfo.total_reviews} đánh giá</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Danh sách đánh giá ({reviews.length})
          </h3>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Chưa có đánh giá nào cho sản phẩm này</p>
              <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  currentUserId={user?.id}
                  onDelete={fetchReviews}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
