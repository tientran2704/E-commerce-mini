import { useTranslation } from 'react-i18next';

/**
 * Sliding window: always shows 4 consecutive pages around current page.
 * Ellipsis appears only when there are hidden pages at either end.
 * Clicking ellipsis jumps by 1 full window (4 pages).
 *
 * Example (total=20):
 *  Page 1  → [1, 2, 3, 4, '...' → jump 5]
 *  Page 5  → [1, '...' → jump 9, 4, 5, 6, '...' → jump 17]
 *  Page 18 → [1, '...' → jump 15, 16, 17, 18, 19, 20]
 */
function getPageItems(currentPage, totalPages, windowSize = 4) {
  if (totalPages <= 0) return [];

  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => ({ type: 'page', value: i + 1 }));
  }

  const half = Math.floor(windowSize / 2);
  const start = Math.max(1, currentPage - half);
  const adjustedStart = Math.max(1, Math.min(start, totalPages - windowSize + 1));
  const end = Math.min(totalPages, adjustedStart + windowSize - 1);

  const items = [];

  if (adjustedStart > 1) {
    items.push({ type: 'page', value: 1 });
    items.push({ type: 'ellipsis', target: adjustedStart });
  }

  for (let i = adjustedStart; i <= end; i++) {
    items.push({ type: 'page', value: i });
  }

  if (end < totalPages) {
    const windowEnd = Math.min(totalPages, end + windowSize);
    items.push({ type: 'ellipsis', target: windowEnd });
    if (end + 1 <= totalPages) {
      items.push({ type: 'page', value: totalPages });
    }
  }

  return items;
}

function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label={t('pagination.label')}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={prevDisabled}
        aria-label={t('pagination.prev')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-800 bg-white text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="sr-only">{t('pagination.prev')}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {items.map((item) =>
        item.type === 'ellipsis' ? (
          <button
            key={`ellipsis-${item.target}`}
            type="button"
            onClick={() => onPageChange(item.target)}
            aria-label={t('pagination.jump_to', { n: item.target })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition hover:border-gray-800 hover:text-gray-800"
          >
            …
          </button>
        ) : (
          <button
            key={item.value}
            type="button"
            onClick={() => onPageChange(item.value)}
            aria-current={item.value === currentPage ? 'page' : undefined}
            aria-label={t('pagination.page', { n: item.value })}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition ${
              item.value === currentPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-800 bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {item.value}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={nextDisabled}
        aria-label={t('pagination.next')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-800 bg-white text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="sr-only">{t('pagination.next')}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
